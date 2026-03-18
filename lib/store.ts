import { create } from "zustand";
import {
  collection, doc, setDoc, deleteDoc, updateDoc, deleteField,
  onSnapshot, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Page {
  id: string;
  title: string;
  icon: string;
  cover?: string;
  content: string;
  parentId?: string | null;
  order?: number;
  children?: Page[];
}

interface AppStore {
  pages: Page[];
  currentPageId: string;
  sidebarOpen: boolean;
  darkMode: boolean;
  loaded: boolean;
  // Actions
  setCurrentPage: (id: string) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  updatePageTitle: (id: string, title: string) => void;
  updatePageContent: (id: string, content: string) => void;
  updatePageCover: (id: string, cover: string | undefined) => void;
  addPage: () => string;
  deletePage: (id: string) => void;
  subscribeToFirestore: () => () => void;
}

// ── Default seed pages (used on first load only) ──────
const DEFAULT_PAGES: Omit<Page, "children">[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    content: `<h1>Welcome to Notion</h1><p>Here are the basics:</p><ul><li>Click anywhere and just start typing</li><li>Hit <strong>/</strong> to see all the types of content you can add</li><li>Highlight any text to <strong>style</strong> your writing</li><li>Click <strong>+ New Page</strong> at the bottom of your sidebar to add a page</li></ul><h2>Shortcut tips</h2><p>Press <strong>Cmd/Ctrl + N</strong> to quickly create a new page.</p>`,
    parentId: null,
    order: 0,
  },
  {
    id: "product-roadmap",
    title: "Product Roadmap",
    icon: "📋",
    cover: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    content: `<h1>Product Roadmap</h1><p>Track what we're building and when it ships.</p><h2>Q1 2024</h2><ul><li>✅ New editor performance improvements</li><li>✅ Database formula upgrades</li><li>🔄 AI writing assistant beta</li></ul><h2>Q2 2024</h2><ul><li>📅 Calendar view enhancements</li><li>📅 Mobile offline support</li><li>📅 Public API v2 launch</li></ul>`,
    parentId: null,
    order: 1,
  },
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    icon: "📝",
    cover: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    content: `<h1>Meeting Notes</h1><h2>Weekly Standup — March 17, 2024</h2><p><strong>Attendees:</strong> Milan, Alex, Sarah, Marcus</p><h3>Updates</h3><ul><li>Milan: Notion clone 80% done, video demo this week</li><li>Alex: Backend API endpoints completed</li><li>Sarah: Design system v2 in review</li></ul><h3>Action Items</h3><ul><li>Milan — finalize demo script by Thursday</li><li>Alex — deploy staging by Friday</li></ul>`,
    parentId: null,
    order: 2,
  },
  {
    id: "team-wiki",
    title: "Team Wiki",
    icon: "📖",
    cover: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    content: `<h1>Team Wiki</h1><p>Everything you need to know about how we work.</p><h2>Our Values</h2><ul><li><strong>Ship fast</strong> — Iterate quickly and get real feedback</li><li><strong>Be direct</strong> — Say what you mean clearly and kindly</li><li><strong>Own it</strong> — Take full responsibility for your work</li></ul><h2>Tools we use</h2><ul><li>📋 Notion — docs, wikis, projects</li><li>💬 Slack — team communication</li><li>🎨 Figma — design</li><li>⚙️ GitHub — code</li></ul>`,
    parentId: null,
    order: 3,
  },
  {
    id: "design-system",
    title: "Design System",
    icon: "🎨",
    cover: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    content: `<h1>Design System</h1><p>Our component library and design guidelines.</p><h2>Colors</h2><p>Primary blue: <strong>#2383E2</strong></p><p>Text primary: <strong>#37352F</strong></p><p>Text secondary: <strong>#787774</strong></p><h2>Typography</h2><p>We use the system font stack: <em>-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial</em></p>`,
    parentId: null,
    order: 4,
  },
  {
    id: "colors",
    title: "Colors",
    icon: "🎨",
    content: "<h1>Colors</h1><p>Our full color system and usage guidelines.</p>",
    parentId: "design-system",
    order: 0,
  },
  {
    id: "typography",
    title: "Typography",
    icon: "✍️",
    content: "<h1>Typography</h1><p>Type scale and font pairing guidelines.</p>",
    parentId: "design-system",
    order: 1,
  },
];

// ── Build nested tree from flat array ─────────────────
function buildTree(flat: Omit<Page, "children">[]): Page[] {
  const map = new Map<string, Page>();
  flat.forEach((p) => map.set(p.id, { ...p, children: [] }));

  const roots: Page[] = [];
  map.forEach((page) => {
    if (page.parentId) {
      const parent = map.get(page.parentId);
      if (parent) parent.children!.push(page);
      else roots.push(page);
    } else {
      roots.push(page);
    }
  });

  const sort = (pages: Page[]): Page[] =>
    pages
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((p) => ({ ...p, children: sort(p.children ?? []) }));

  return sort(roots);
}

// ── Firestore helpers ─────────────────────────────────
const COLLECTION = "notion_pages";

/** Remove every key whose value is undefined — Firestore rejects undefined */
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

async function savePage(page: Omit<Page, "children">) {
  try {
    const data = stripUndefined({
      id: page.id,
      title: page.title ?? "",
      icon: page.icon ?? "📄",
      content: page.content ?? "",
      parentId: page.parentId ?? null,
      order: page.order ?? 0,
      // cover only included when it's a real string (undefined = omitted, null-ish = omitted)
      ...(page.cover ? { cover: page.cover } : {}),
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, COLLECTION, page.id), data);
  } catch (e) {
    console.error("Firestore save error:", e);
  }
}

async function removePage(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (e) {
    console.error("Firestore delete error:", e);
  }
}

// ── Zustand Store ─────────────────────────────────────
export const useAppStore = create<AppStore>((set, get) => ({
  pages: buildTree(DEFAULT_PAGES),
  currentPageId: "getting-started",
  sidebarOpen: true,
  darkMode: true,
  loaded: false,

  setCurrentPage: (id) => set({ currentPageId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDarkMode: () => set((s) => {
    const next = !s.darkMode;
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    }
    return { darkMode: next };
  }),

  updatePageTitle: (id, title) => {
    set((s) => ({ pages: updateInTree(s.pages, id, (p) => ({ ...p, title })) }));
    const flat = flattenPages(get().pages);
    const page = flat.find((p) => p.id === id);
    if (page) { const { children: _c, ...rest } = page as Page; savePage({ ...rest, title }); }
  },

  updatePageContent: (id, content) => {
    set((s) => ({ pages: updateInTree(s.pages, id, (p) => ({ ...p, content })) }));
    const flat = flattenPages(get().pages);
    const page = flat.find((p) => p.id === id);
    if (page) { const { children: _c, ...rest } = page as Page; savePage({ ...rest, content }); }
  },

  updatePageCover: (id, cover) => {
    set((s) => ({ pages: updateInTree(s.pages, id, (p) => ({ ...p, cover })) }));
    // cover=undefined means "remove" — use deleteField() sentinel, never pass undefined to Firestore
    try {
      if (cover === undefined) {
        updateDoc(doc(db, COLLECTION, id), { cover: deleteField() });
      } else {
        const flat = flattenPages(get().pages);
        const page = flat.find((p) => p.id === id);
        if (page) { const { children: _c, ...rest } = page as Page; savePage({ ...rest, cover }); }
      }
    } catch (e) {
      console.error("Firestore cover update error:", e);
    }
  },

  addPage: () => {
    const id = `page-${Date.now()}`;
    const newPage: Omit<Page, "children"> = {
      id,
      title: "Untitled",
      icon: "📄",
      content: "",
      parentId: null,
      order: get().pages.length,
    };
    set((s) => ({
      pages: [...s.pages, { ...newPage, children: [] }],
      currentPageId: id,
    }));
    savePage(newPage);
    return id;
  },

  deletePage: (id) => {
    set((s) => {
      const newPages = deleteFromTree(s.pages, id);
      const flat = flattenPages(newPages);
      const newCurrent = s.currentPageId === id ? (flat[0]?.id ?? "") : s.currentPageId;
      return { pages: newPages, currentPageId: newCurrent };
    });
    removePage(id);
  },

  // Subscribe to Firestore real-time updates
  subscribeToFirestore: () => {
    const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // First time — seed default pages
          DEFAULT_PAGES.forEach((p) => savePage(p));
          return;
        }
        const flat = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? "Untitled",
            icon: data.icon ?? "📄",
            cover: data.cover,
            content: data.content ?? "",
            parentId: data.parentId ?? null,
            order: data.order ?? 0,
          } as Omit<Page, "children">;
        });
        set({ pages: buildTree(flat), loaded: true });
      },
      (error) => {
        console.error("Firestore subscription error:", error);
        // Fallback to default pages if Firestore fails
        set({ loaded: true });
      }
    );
    return unsub;
  },
}));

// ── Tree helpers ──────────────────────────────────────
export function flattenPages(pages: Page[]): Page[] {
  return pages.flatMap((p) => [p, ...flattenPages(p.children ?? [])]);
}

export function findPage(pages: Page[], id: string): Page | undefined {
  for (const page of pages) {
    if (page.id === id) return page;
    const found = findPage(page.children ?? [], id);
    if (found) return found;
  }
}

function updateInTree(pages: Page[], id: string, updater: (p: Page) => Page): Page[] {
  return pages.map((p) => {
    if (p.id === id) return updater(p);
    return { ...p, children: updateInTree(p.children ?? [], id, updater) };
  });
}

function deleteFromTree(pages: Page[], id: string): Page[] {
  return pages
    .filter((p) => p.id !== id)
    .map((p) => ({ ...p, children: deleteFromTree(p.children ?? [], id) }));
}

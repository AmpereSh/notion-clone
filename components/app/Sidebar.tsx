"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, type Page } from "@/lib/store";

// ── Notion-accurate SVG Icons ──────────────────────────
const Icons = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.5 11a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 7L8 1.5 14.5 7V14a.5.5 0 01-.5.5H10v-4H6v4H2a.5.5 0 01-.5-.5V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  Inbox: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 9.5h3l1.5 2h4l1.5-2h3M1.5 9.5V13a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V9.5M1.5 9.5L4 3h8l2.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.1 3.1l.7.7M12.2 12.2l.7.7M3.1 12.9l.7-.7M12.2 3.8l.7-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Library: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="6.5" y="2" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M11.5 2.5l2.5 11M11.5 2.5l-1 .2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  NotionAI: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2l1.2 3.8H13L10 7.8l1.2 3.8L8 9.5l-3.2 2.1L6 7.8 3 5.8h3.8L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  Page: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M4 2h5.5L12 4.5V14a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1h0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Grid: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z"/>
    </svg>
  ),
  Dots: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M6 4V3h4v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sun: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Moon: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 10A6 6 0 116 2.5a4.5 4.5 0 007.5 7.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  NewAgent: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2.5 14c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

// ── Context menu for page actions ─────────────────────
function PageContextMenu({
  pageId,
  onClose,
  anchorRect,
  darkMode,
}: {
  pageId: string;
  onClose: () => void;
  anchorRect: DOMRect | null;
  darkMode: boolean;
}) {
  const { deletePage, pages } = useAppStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const handleDelete = () => {
    onClose();
    // Navigate away before deleting if it's the current page
    const allPages = pages.flatMap(function flat(p): typeof pages { return [p, ...(p.children ?? []).flatMap(flat)]; });
    const next = allPages.find((p) => p.id !== pageId);
    if (next) router.push(`/app/${next.id}`);
    setTimeout(() => deletePage(pageId), 50);
  };

  if (!anchorRect) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: anchorRect.bottom + 4,
        left: anchorRect.left,
        zIndex: 999,
        background: darkMode ? "#2f2f2f" : "#ffffff",
        border: `1px solid ${darkMode ? "#444" : "#e9e9e7"}`,
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        padding: "4px",
        minWidth: "180px",
      }}
    >
      <button
        onClick={handleDelete}
        style={{
          display: "flex", alignItems: "center", gap: "8px", width: "100%",
          padding: "6px 10px", fontSize: "13px",
          color: "#eb5757", background: "none", border: "none",
          borderRadius: "5px", cursor: "pointer", textAlign: "left",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(235,87,87,0.12)" : "#fef2f2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <Icons.Trash />
        Delete page
      </button>
    </div>
  );
}

// ── Page Tree Item ─────────────────────────────────────
function PageItem({ page, depth = 0 }: { page: Page; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0 && !!page.children?.length);
  const [hovered, setHovered] = useState(false);
  const [contextAnchor, setContextAnchor] = useState<DOMRect | null>(null);
  const { currentPageId, setCurrentPage, addPage, darkMode } = useAppStore();
  const router = useRouter();
  const isActive = currentPageId === page.id;
  const hasChildren = (page.children?.length ?? 0) > 0;
  const isEmojiIcon = page.icon && /\p{Emoji}/u.test(page.icon);

  const bgColor = isActive
    ? (darkMode ? "rgba(255,255,255,0.08)" : "#e9e8e4")
    : hovered
    ? (darkMode ? "rgba(255,255,255,0.05)" : "#efefed")
    : "transparent";

  return (
    <div>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => { setCurrentPage(page.id); router.push(`/app/${page.id}`); }}
        style={{
          display: "flex", alignItems: "center", gap: "2px",
          paddingLeft: `${6 + depth * 14}px`, paddingRight: "6px",
          paddingTop: "3px", paddingBottom: "3px",
          borderRadius: "6px", cursor: "pointer",
          background: bgColor, margin: "1px 4px", userSelect: "none",
          color: "var(--text)", position: "relative",
        }}
      >
        {/* Expand toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          style={{
            width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "4px", border: "none", background: "none", cursor: "pointer",
            flexShrink: 0, opacity: hovered ? 1 : 0, transition: "opacity 0.1s", color: "var(--text-secondary)",
          }}
        >
          {expanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
        </button>

        {/* Icon */}
        <span style={{ fontSize: isEmojiIcon ? "14px" : "12px", lineHeight: 1, flexShrink: 0, marginRight: "4px", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
          {isEmojiIcon ? page.icon : <Icons.Page />}
        </span>

        {/* Title */}
        <span style={{
          fontSize: "13px", color: "var(--text)", flex: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          fontWeight: isActive ? 500 : 400,
        }}>
          {page.title || "Untitled"}
        </span>

        {/* Hover actions */}
        {hovered && (
          <div style={{ display: "flex", alignItems: "center", gap: "1px", flexShrink: 0 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setContextAnchor(e.currentTarget.getBoundingClientRect());
              }}
              style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", borderRadius: "4px", cursor: "pointer", color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.1)" : "#e0dedd")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              title="More options"
            ><Icons.Dots /></button>
            <button onClick={(e) => { e.stopPropagation(); const id = addPage(); router.push(`/app/${id}`); }}
              style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", borderRadius: "4px", cursor: "pointer", color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.1)" : "#e0dedd")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              title="Add sub-page"
            ><Icons.Plus /></button>
          </div>
        )}
      </div>

      {/* Context menu portal */}
      {contextAnchor && (
        <PageContextMenu
          pageId={page.id}
          onClose={() => setContextAnchor(null)}
          anchorRect={contextAnchor}
          darkMode={darkMode}
        />
      )}

      {expanded && hasChildren && page.children!.map((child) => (
        <PageItem key={child.id} page={child} depth={depth + 1} />
      ))}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────
export default function Sidebar() {
  const { pages, sidebarOpen, toggleSidebar, toggleDarkMode, darkMode, addPage } = useAppStore();
  const router = useRouter();

  const btnStyle = {
    width: "calc(100% - 8px)", display: "flex", alignItems: "center", gap: "8px",
    padding: "5px 8px", margin: "1px 4px",
    borderRadius: "6px", border: "none", background: "none",
    cursor: "pointer", textAlign: "left" as const, color: "var(--text)",
  };

  if (!sidebarOpen) {
    return (
      <button onClick={toggleSidebar} style={{
        position: "fixed", left: 0, top: "16px", zIndex: 20,
        padding: "8px", background: "var(--bg-secondary)",
        border: "1px solid var(--border)", borderLeft: "none",
        borderRadius: "0 6px 6px 0", cursor: "pointer",
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)", color: "var(--text-secondary)",
      }}>
        <Icons.ChevronRight />
      </button>
    );
  }

  return (
    <aside style={{
      width: "240px", flexShrink: 0, background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--border)", display: "flex",
      flexDirection: "column", height: "100%", overflow: "hidden",
    }}>
      {/* Workspace header — use div to avoid button-in-button */}
      <div style={{ padding: "6px 8px", flexShrink: 0 }}>
        <div style={{ ...btnStyle, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <div style={{
            width: "22px", height: "22px", borderRadius: "5px",
            background: "linear-gradient(135deg, #2383e2, #9065b0)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: "11px", color: "white", fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Milan&apos;s Workspace
          </span>
          <button onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
            style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px", borderRadius: "3px", flexShrink: 0 }}
          >
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ padding: "2px 4px", flexShrink: 0 }}>
        {[
          { icon: <Icons.Search />, label: "Search", kbd: "⌘K" },
          { icon: <Icons.Home />, label: "Home" },
          { icon: <Icons.NotionAI />, label: "Notion AI" },
          { icon: <Icons.Inbox />, label: "Inbox", badge: 3 },
          { icon: <Icons.Library />, label: "Library" },
        ].map(({ icon, label, kbd, badge }) => (
          <button key={label} style={{ ...btnStyle }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: "13px", color: "var(--text)", flex: 1 }}>{label}</span>
            {kbd && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{kbd}</span>}
            {badge && <span style={{ fontSize: "10px", background: "var(--red)", color: "white", borderRadius: "10px", padding: "1px 5px", fontWeight: 600 }}>{badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ height: "1px", background: "var(--border)", margin: "4px 12px", flexShrink: 0 }} />

      {/* Scrollable pages area */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "2px 0" }}>

        {/* Recents */}
        <div style={{ padding: "6px 12px 2px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Recents
        </div>
        {pages.slice(0, 2).map((page) => (
          <PageItem key={`recent-${page.id}`} page={page} />
        ))}

        {/* Agents Beta */}
        <div style={{ padding: "10px 12px 2px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Agents</span>
          <span style={{ fontSize: "10px", color: "var(--blue)", background: darkMode ? "rgba(82,156,202,0.15)" : "#e7f3fb", borderRadius: "4px", padding: "1px 5px", fontWeight: 500 }}>Beta</span>
        </div>
        <button style={{ ...btnStyle }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}><Icons.NewAgent /></span>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>+ New agent</span>
        </button>

        {/* Private pages */}
        <div style={{ padding: "10px 12px 2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Private</span>
          <button onClick={() => { const id = addPage(); router.push(`/app/${id}`); }}
            style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "2px", borderRadius: "3px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          ><Icons.Plus /></button>
        </div>
        {pages.map((page) => (
          <PageItem key={page.id} page={page} />
        ))}

        {/* Teamspaces */}
        <div style={{ padding: "10px 12px 2px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Teamspaces
        </div>
        <button style={{ ...btnStyle }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <span style={{ fontSize: "14px" }}>🏠</span>
          <span style={{ fontSize: "13px", color: "var(--text)" }}>Milan&apos;s Space HQ</span>
        </button>

        {/* New page */}
        <div style={{ height: "1px", background: "var(--border)", margin: "6px 12px" }} />
        <button onClick={() => { const id = addPage(); router.push(`/app/${id}`); }}
          style={{ ...btnStyle }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}><Icons.Plus /></span>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>New page</span>
        </button>
      </div>

      {/* Bottom: Trash + Dark mode toggle */}
      <div style={{ padding: "4px 8px 8px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <button style={{ ...btnStyle }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center" }}><Icons.Trash /></span>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Trash</span>
        </button>

        {/* Dark/Light toggle */}
        <button onClick={toggleDarkMode} style={{ ...btnStyle }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
            {darkMode ? <Icons.Sun /> : <Icons.Moon />}
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            {darkMode ? "Light mode" : "Dark mode"}
          </span>
        </button>
      </div>
    </aside>
  );
}

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  MoreHorizontal, Share, Clock,
  Heading1, Heading2, Heading3, List, ListOrdered,
  CheckSquare, Quote, Code, Minus, Type,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import SlashMenu, { type SlashCommand } from "./SlashMenu";
import Database from "./Database";

const COVERS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
];

export default function Editor({ pageId }: { pageId: string }) {
  const { pages, currentPageId, setCurrentPage, updatePageTitle, updatePageContent, updatePageCover } = useAppStore();
  const [showSlash, setShowSlash] = useState(false);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [coverHovered, setCoverHovered] = useState(false);
  const [topHovered, setTopHovered] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Find page including nested children
  let page = pages.find((p) => p.id === pageId);
  if (!page) {
    for (const p of pages) {
      const child = (p.children ?? []).find((c) => c.id === pageId);
      if (child) { page = child; break; }
    }
  }
  if (!page) page = pages[0];

  useEffect(() => {
    if (pageId && pageId !== currentPageId) setCurrentPage(pageId);
  }, [pageId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "Press 'space' for AI or '/' for commands" }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: page?.content || "",
    onUpdate: ({ editor }) => {
      if (page) updatePageContent(page.id, editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (event.key === "/" && !showSlash) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            setSlashPos({ top: rect.bottom + 4, left: rect.left });
          }
          setTimeout(() => setShowSlash(true), 10);
          return false;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && page) {
      const current = editor.getHTML();
      if (current !== page.content) editor.commands.setContent(page.content || "");
    }
  }, [page?.id]);

  const closeSlash = useCallback(() => {
    setShowSlash(false);
    if (editor) {
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 1), from);
      if (textBefore === "/") {
        editor.chain().focus().deleteRange({ from: from - 1, to: from }).run();
      }
    }
  }, [editor]);

  const slashCommands: SlashCommand[] = [
    { id: "text",     icon: Type,         label: "Text",          description: "Just start writing with plain text",    action: () => editor?.chain().focus().setParagraph().run() },
    { id: "h1",       icon: Heading1,     label: "Heading 1",     description: "Big section heading",                   action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { id: "h2",       icon: Heading2,     label: "Heading 2",     description: "Medium section heading",                action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { id: "h3",       icon: Heading3,     label: "Heading 3",     description: "Small section heading",                 action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { id: "bullet",   icon: List,         label: "Bulleted list",  description: "Create a simple bulleted list",        action: () => editor?.chain().focus().toggleBulletList().run() },
    { id: "numbered", icon: ListOrdered,  label: "Numbered list",  description: "Create a numbered list",              action: () => editor?.chain().focus().toggleOrderedList().run() },
    { id: "todo",     icon: CheckSquare,  label: "To-do list",    description: "Track tasks with a to-do list",         action: () => editor?.chain().focus().toggleTaskList().run() },
    { id: "quote",    icon: Quote,        label: "Quote",         description: "Capture a quote",                       action: () => editor?.chain().focus().toggleBlockquote().run() },
    { id: "code",     icon: Code,         label: "Code block",    description: "Capture a code snippet",                action: () => editor?.chain().focus().toggleCodeBlock().run() },
    { id: "divider",  icon: Minus,        label: "Divider",       description: "Visually divide blocks",                action: () => editor?.chain().focus().setHorizontalRule().run() },
  ];

  if (!page) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>Page not found</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>

      {/* ── Cover ── */}
      {page.cover && (
        <div
          style={{ position: "relative", width: "100%", height: "180px", background: page.cover, flexShrink: 0, cursor: "default" }}
          onMouseEnter={() => setCoverHovered(true)}
          onMouseLeave={() => { setCoverHovered(false); setShowCoverPicker(false); }}
        >
          {/* Hover buttons */}
          <div style={{
            position: "absolute", bottom: "12px", right: "16px",
            display: "flex", gap: "8px",
            opacity: coverHovered ? 1 : 0,
            transition: "opacity 0.15s",
            pointerEvents: coverHovered ? "auto" : "none",
          }}>
            <button
              onClick={() => setShowCoverPicker(!showCoverPicker)}
              style={{
                padding: "5px 14px",
                background: "rgba(30,30,30,0.72)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#ffffff",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Change cover
            </button>
            <button
              onClick={() => updatePageCover(page!.id, undefined)}
              style={{
                padding: "5px 14px",
                background: "rgba(30,30,30,0.72)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#ffffff",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Remove
            </button>
          </div>

          {/* Cover picker */}
          {showCoverPicker && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ position: "absolute", bottom: "48px", right: "16px", background: "var(--bg)", borderRadius: "10px", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", border: "1px solid var(--border)", padding: "12px", zIndex: 20 }}
            >
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gallery</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 64px)", gap: "8px" }}>
                {COVERS.map((c, i) => (
                  <button
                    key={i}
                    style={{ width: "64px", height: "40px", borderRadius: "6px", background: c, border: "2px solid transparent", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2383e2")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                    onClick={() => { updatePageCover(page!.id, c); setShowCoverPicker(false); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Main content ── */}
      <div
        style={{ maxWidth: "900px", width: "100%", margin: "0 auto", padding: "24px 96px 48px", flex: 1 }}
        onMouseEnter={() => setTopHovered(true)}
        onMouseLeave={() => setTopHovered(false)}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", color: "var(--text-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
            <span style={{ cursor: "pointer", color: "var(--text-secondary)" }}>Milan&apos;s Workspace</span>
            <span style={{ color: "var(--text-muted)" }}>/</span>
            <span style={{ color: "var(--text)" }}>{page.title || "Untitled"}</span>
            <span style={{ marginLeft: "4px", padding: "1px 6px", borderRadius: "4px", background: "var(--bg-hover)", fontSize: "11px", color: "var(--text-secondary)", cursor: "pointer" }}>
              🔒 Private ▾
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {[
              { icon: <Share style={{ width: "13px", height: "13px" }} />, label: "Share" },
              { icon: <Clock style={{ width: "13px", height: "13px" }} />, label: "Updated just now" },
            ].map((btn) => (
              <button key={btn.label} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 8px", fontSize: "12px", color: "var(--text-secondary)", background: "none", border: "none", borderRadius: "6px", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
            <button style={{ padding: "4px", color: "var(--text-secondary)", background: "none", border: "none", borderRadius: "6px", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <MoreHorizontal style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
        </div>

        {/* Add cover/icon hover actions */}
        {!page.cover && (
          <div style={{ height: "28px", marginBottom: "4px", display: "flex", gap: "4px", opacity: topHovered ? 1 : 0, transition: "opacity 0.15s" }}>
            <button
              onClick={() => updatePageCover(page!.id, COVERS[Math.floor(Math.random() * COVERS.length)])}
              style={{ padding: "4px 10px", fontSize: "12px", color: "var(--text-muted)", background: "none", border: "none", borderRadius: "5px", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#efefef"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              🖼️ Add cover
            </button>
            <button
              style={{ padding: "4px 10px", fontSize: "12px", color: "var(--text-muted)", background: "none", border: "none", borderRadius: "5px", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#efefef"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              😀 Add icon
            </button>
          </div>
        )}

        {/* Emoji icon */}
        <div style={{ fontSize: "56px", lineHeight: 1, marginBottom: "12px", cursor: "pointer", userSelect: "none", display: "inline-block" }}>
          {page.icon}
        </div>

        {/* Title */}
        <input
          value={page.title}
          onChange={(e) => updatePageTitle(page!.id, e.target.value)}
          placeholder="Untitled"
          style={{ width: "100%", fontSize: "40px", fontWeight: 700, color: "var(--text)", border: "none", outline: "none", background: "transparent", marginBottom: "4px", lineHeight: 1.2, fontFamily: "inherit" }}
        />

        {/* Tiptap editor */}
        <div ref={editorContainerRef} style={{ position: "relative", marginTop: "8px" }}>
          <EditorContent editor={editor} />
          {showSlash && <SlashMenu commands={slashCommands} onClose={closeSlash} position={slashPos} />}
        </div>

        {/* "Get started with" quick actions — only on empty pages */}
        {(!page.content || page.content === "<p></p>" || page.content === "") && (
          <div style={{ marginTop: "48px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "10px" }}>Get started with</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { emoji: "✨", label: "Ask AI" },
                { emoji: "🗓️", label: "AI Meeting Notes" },
                { emoji: "⊞", label: "Database" },
                { emoji: "📋", label: "Form" },
                { emoji: "🎨", label: "Templates" },
              ].map((item) => (
                <button key={item.label}
                  onClick={() => editor?.chain().focus().run()}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "6px 12px", borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-secondary)",
                    color: "var(--text)", fontSize: "13px",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              <button style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "8px",
                border: "1px solid var(--border)", background: "var(--bg-secondary)",
                color: "var(--text-secondary)", cursor: "pointer",
              }}>···</button>
            </div>
          </div>
        )}

        {/* Inline database */}
        {(page.id === "product-roadmap" || page.id === "team-wiki") && (
          <div style={{ marginTop: "40px", marginBottom: "40px" }}>
            <Database />
          </div>
        )}
      </div>
    </div>
  );
}

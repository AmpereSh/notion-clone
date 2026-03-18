"use client";
import { useState, useRef, useEffect } from "react";
import {
  Plus, Trash2, ChevronDown, Search,
  Filter, ArrowUpDown, Columns,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
type Status = "Not started" | "In progress" | "Done" | "Cancelled";
type Priority = "Low" | "Medium" | "High" | "Urgent";

interface Row {
  id: string;
  name: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  assignee: string;
  tags: string[];
}

// ── Static config — colors work on both light & dark ──
const STATUS_CONFIG: Record<Status, { color: string; bg: string; dot: string; darkBg: string; darkColor: string }> = {
  "Not started": { color: "#6b6b6b", bg: "#ebebea",      dot: "#aaa",    darkBg: "rgba(255,255,255,0.1)",  darkColor: "#aaa" },
  "In progress": { color: "#1d6fbc", bg: "#daeaf8",      dot: "#2383e2", darkBg: "rgba(35,131,226,0.2)",   darkColor: "#529cca" },
  "Done":        { color: "#2d8c7d", bg: "#d8f5ee",      dot: "#4dab9a", darkBg: "rgba(77,171,154,0.2)",   darkColor: "#4dab9a" },
  "Cancelled":   { color: "#6b6b6b", bg: "#ebebea",      dot: "#999",    darkBg: "rgba(255,255,255,0.08)", darkColor: "#888" },
};

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; emoji: string; darkBg: string; darkColor: string }> = {
  "Low":    { color: "#2d8c7d", bg: "#d8f5ee", emoji: "🟢", darkBg: "rgba(77,171,154,0.18)",  darkColor: "#4dab9a" },
  "Medium": { color: "#c47b10", bg: "#fde9c0", emoji: "🟡", darkBg: "rgba(255,163,68,0.18)",  darkColor: "#ffa344" },
  "High":   { color: "#b83232", bg: "#fcd9d9", emoji: "🔴", darkBg: "rgba(235,87,87,0.18)",   darkColor: "#eb5757" },
  "Urgent": { color: "#6b3d8a", bg: "#ead8f8", emoji: "🔥", darkBg: "rgba(144,101,176,0.22)", darkColor: "#b68fd4" },
};

const ALL_STATUSES: Status[]   = ["Not started", "In progress", "Done", "Cancelled"];
const ALL_PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];

const ASSIGNEES = ["Milan", "Alex", "Sarah", "Marcus", "Priya", "Jordan"];

const DEFAULT_ROWS: Row[] = [
  { id: "1", name: "Launch marketing website",   status: "Done",        priority: "High",   dueDate: "2024-03-15", assignee: "Milan",   tags: ["marketing"] },
  { id: "2", name: "Fix authentication bug",      status: "In progress", priority: "Urgent", dueDate: "2024-03-18", assignee: "Alex",    tags: ["bug"] },
  { id: "3", name: "Update API documentation",    status: "Not started", priority: "Low",    dueDate: "2024-03-25", assignee: "Sarah",   tags: ["docs"] },
  { id: "4", name: "Design system v2",            status: "In progress", priority: "Medium", dueDate: "2024-03-20", assignee: "Sarah",   tags: ["design"] },
  { id: "5", name: "Onboard new team members",    status: "Not started", priority: "Medium", dueDate: "2024-03-22", assignee: "Marcus",  tags: ["hr"] },
  { id: "6", name: "Performance audit",           status: "Done",        priority: "High",   dueDate: "2024-03-10", assignee: "Alex",    tags: ["devops"] },
  { id: "7", name: "Mobile app beta release",     status: "In progress", priority: "High",   dueDate: "2024-03-28", assignee: "Priya",  tags: ["mobile"] },
  { id: "8", name: "Q2 OKR planning session",     status: "Not started", priority: "Medium", dueDate: "2024-04-01", assignee: "Milan",   tags: ["planning"] },
];

// ── Small reusable components ──────────────────────────
function StatusBadge({ value, onClick }: { value: Status; onClick?: () => void }) {
  const c = STATUS_CONFIG[value];
  return (
    <button
      onClick={onClick}
      className="db-status-badge flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold transition-opacity hover:opacity-80 whitespace-nowrap"
      data-status={value}
      style={{
        background: `var(--status-bg-${value.replace(/ /g,"-").toLowerCase()})`,
        color: `var(--status-color-${value.replace(/ /g,"-").toLowerCase()})`,
      }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.dot }} />
      {value}
    </button>
  );
}

function PriorityBadge({ value, onClick }: { value: Priority; onClick?: () => void }) {
  const c = PRIORITY_CONFIG[value];
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold transition-opacity hover:opacity-80 whitespace-nowrap"
      style={{
        background: `var(--priority-bg-${value.toLowerCase()})`,
        color: `var(--priority-color-${value.toLowerCase()})`,
      }}
    >
      <span className="text-[11px]">{c.emoji}</span>
      {value}
    </button>
  );
}

// Inline editable cell
function EditableCell({
  value,
  onChange,
  placeholder = "Empty",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => { onChange(draft); setEditing(false); };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
        className={`w-full bg-[var(--bg)] border border-[#2383e2] rounded px-1 py-0.5 text-[13px] text-[var(--text)] outline-none ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      className={`cursor-text hover:bg-[var(--bg-hover)] rounded px-1 py-0.5 text-[13px] text-[var(--text)] block truncate ${!value ? "text-[var(--text-muted)]" : ""} ${className}`}
    >
      {value || placeholder}
    </span>
  );
}

// Dropdown picker for status / priority / assignee
function Picker<T extends string>({
  options,
  value,
  onSelect,
  renderOption,
  onClose,
}: {
  options: T[];
  value: T;
  onSelect: (v: T) => void;
  renderOption: (v: T, selected: boolean) => React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 bg-[var(--bg)] rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[var(--border)] py-1 min-w-[180px]"
      style={{ top: "calc(100% + 4px)", left: 0 }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => { onSelect(opt); onClose(); }}
          className={`w-full px-3 py-[6px] text-left hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2 ${opt === value ? "bg-[var(--bg-secondary)]" : ""}`}
        >
          {renderOption(opt, opt === value)}
        </button>
      ))}
    </div>
  );
}

// ── Main Database Component ────────────────────────────
export default function Database() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [openPicker, setOpenPicker] = useState<{ rowId: string; field: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const updateRow = (id: string, field: keyof Row, value: string | string[]) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    const id = `row-${Date.now()}`;
    setRows((prev) => [
      ...prev,
      { id, name: "", status: "Not started", priority: "Medium", dueDate: "", assignee: "", tags: [] },
    ]);
  };

  const deleteRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const filtered = rows.filter((r) =>
    !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const counts = {
    done: rows.filter((r) => r.status === "Done").length,
    inProgress: rows.filter((r) => r.status === "In progress").length,
    notStarted: rows.filter((r) => r.status === "Not started").length,
  };

  return (
    <div className="w-full">
      {/* Database header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-semibold text-[var(--text)]">📊 Project Tasks</h2>
          <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
            <span className="px-2.5 py-0.5 rounded-full font-semibold text-[12px]" style={{ background: "var(--status-bg-done)", color: "var(--status-color-done)" }}>{counts.done} done</span>
            <span className="px-2.5 py-0.5 rounded-full font-semibold text-[12px]" style={{ background: "var(--status-bg-in-progress)", color: "var(--status-color-in-progress)" }}>{counts.inProgress} in progress</span>
            <span className="px-2.5 py-0.5 rounded-full font-semibold text-[12px]" style={{ background: "var(--status-bg-not-started)", color: "var(--status-color-not-started)" }}>{counts.notStarted} not started</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {showSearch && (
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setShowSearch(false); }}
              placeholder="Search..."
              className="border border-[var(--border)] rounded-md px-2 py-1 text-[12px] outline-none focus:border-[#2383e2] w-36"
            />
          )}
          {[
            { icon: Search, label: "Search", action: () => setShowSearch(!showSearch) },
            { icon: Filter, label: "Filter", action: () => {} },
            { icon: ArrowUpDown, label: "Sort", action: () => {} },
            { icon: Columns, label: "Properties", action: () => {} },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table — min-width ensures readability, outer div scrolls */}
      <div className="border border-[var(--border)] rounded-lg overflow-x-auto bg-[var(--bg)]">
        <div style={{ minWidth: "780px" }}>
        {/* Column headers */}
        <div className="grid border-b border-[var(--border)] bg-[var(--bg-secondary)]"
          style={{ gridTemplateColumns: "minmax(220px,2.5fr) minmax(140px,1fr) minmax(130px,1fr) minmax(130px,1fr) minmax(130px,1fr) 44px" }}>
          {[
            { label: "Name", icon: <FileNameIcon /> },
            { label: "Status", icon: <StatusIcon /> },
            { label: "Priority", icon: <PriorityIcon /> },
            { label: "Due Date", icon: <CalIcon /> },
            { label: "Assignee", icon: <PersonIcon /> },
            { label: "", icon: null },
          ].map((col, i) => (
            <div
              key={i}
              className="px-4 py-3 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-secondary)] border-r border-[var(--border)] last:border-r-0 hover:bg-[var(--bg-hover)] cursor-pointer transition-colors uppercase tracking-wide"
            >
              {col.icon}
              {col.label && <span>{col.label}</span>}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((row) => (
          <div
            key={row.id}
            className={`grid border-b border-[var(--border)] last:border-b-0 group transition-colors ${hoveredRow === row.id ? "bg-[var(--bg-secondary)]" : "hover:bg-[var(--bg-secondary)]"}`}
            style={{ gridTemplateColumns: "minmax(220px,2.5fr) minmax(140px,1fr) minmax(130px,1fr) minmax(130px,1fr) minmax(130px,1fr) 44px" }}
            onMouseEnter={() => setHoveredRow(row.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {/* Name */}
            <div className="px-4 py-3 border-r border-[var(--border)] flex items-center gap-2">
              <span className="text-[14px] shrink-0">📄</span>
              <EditableCell
                value={row.name}
                onChange={(v) => updateRow(row.id, "name", v)}
                placeholder="Untitled"
                className="font-medium text-[13px]"
              />
            </div>

            {/* Status */}
            <div className="px-4 py-3 border-r border-[var(--border)] relative flex items-center">
              <StatusBadge
                value={row.status}
                onClick={() => setOpenPicker(openPicker?.rowId === row.id && openPicker.field === "status" ? null : { rowId: row.id, field: "status" })}
              />
              {openPicker?.rowId === row.id && openPicker.field === "status" && (
                <Picker
                  options={ALL_STATUSES}
                  value={row.status}
                  onSelect={(v) => updateRow(row.id, "status", v)}
                  onClose={() => setOpenPicker(null)}
                  renderOption={(opt, selected) => (
                    <>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_CONFIG[opt].dot }} />
                      <span className="text-[13px] text-[var(--text)]">{opt}</span>
                      {selected && <span className="ml-auto text-[#2383e2]">✓</span>}
                    </>
                  )}
                />
              )}
            </div>

            {/* Priority */}
            <div className="px-4 py-3 border-r border-[var(--border)] relative flex items-center">
              <PriorityBadge
                value={row.priority}
                onClick={() => setOpenPicker(openPicker?.rowId === row.id && openPicker.field === "priority" ? null : { rowId: row.id, field: "priority" })}
              />
              {openPicker?.rowId === row.id && openPicker.field === "priority" && (
                <Picker
                  options={ALL_PRIORITIES}
                  value={row.priority}
                  onSelect={(v) => updateRow(row.id, "priority", v)}
                  onClose={() => setOpenPicker(null)}
                  renderOption={(opt, selected) => (
                    <>
                      <span className="text-[13px]">{PRIORITY_CONFIG[opt].emoji}</span>
                      <span className="text-[13px] text-[var(--text)]">{opt}</span>
                      {selected && <span className="ml-auto text-[#2383e2]">✓</span>}
                    </>
                  )}
                />
              )}
            </div>

            {/* Due Date */}
            <div className="px-4 py-3 border-r border-[var(--border)] relative flex items-center">
              <div className="relative w-full">
                <input
                  type="date"
                  value={row.dueDate}
                  onChange={(e) => updateRow(row.id, "dueDate", e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  style={{ zIndex: 1 }}
                />
                <span className="text-[13px] text-[var(--text)] select-none pointer-events-none">
                  {row.dueDate
                    ? new Date(row.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : <span className="text-[var(--text-muted)]">Empty</span>}
                </span>
              </div>
            </div>

            {/* Assignee */}
            <div className="px-4 py-3 border-r border-[var(--border)] relative flex items-center">
              <button
                onClick={() => setOpenPicker(openPicker?.rowId === row.id && openPicker.field === "assignee" ? null : { rowId: row.id, field: "assignee" })}
                className="flex items-center gap-2 hover:bg-[var(--bg-hover)] rounded px-1 py-0.5 transition-colors w-full"
              >
                {row.assignee ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2383e2] to-[#9065b0] flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-white font-bold">{row.assignee[0]}</span>
                    </div>
                    <span className="text-[13px] text-[var(--text)]">{row.assignee}</span>
                  </>
                ) : (
                  <span className="text-[13px] text-[var(--text-muted)]">Empty</span>
                )}
              </button>
              {openPicker?.rowId === row.id && openPicker.field === "assignee" && (
                <Picker
                  options={ASSIGNEES as any}
                  value={row.assignee as any}
                  onSelect={(v) => updateRow(row.id, "assignee", v)}
                  onClose={() => setOpenPicker(null)}
                  renderOption={(opt, selected) => (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2383e2] to-[#9065b0] flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-white font-bold">{opt[0]}</span>
                      </div>
                      <span className="text-[13px] text-[var(--text)]">{opt}</span>
                      {selected && <span className="ml-auto text-[#2383e2]">✓</span>}
                    </>
                  )}
                />
              )}
            </div>

            {/* Row actions */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => deleteRow(row.id)}
                className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete row"
              >
                <Trash2 className="w-4 h-4 text-[var(--text-secondary)] hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}

        {/* Add row */}
        <div
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-3 hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors group"
        >
          <Plus className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-[13px] text-[var(--text-secondary)]">New</span>
        </div>
        </div>{/* end minWidth wrapper */}
      </div>

      {/* Row count */}
      <div className="mt-2 px-1">
        <span className="text-[12px] text-[var(--text-secondary)]">{filtered.length} rows</span>
      </div>
    </div>
  );
}

// ── Column header icons (inline SVG) ──────────────────
function FileNameIcon() {
  return <svg className="w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function StatusIcon() {
  return <svg className="w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2}/><path strokeLinecap="round" strokeWidth={2} d="M12 8v4l3 3"/></svg>;
}
function PriorityIcon() {
  return <svg className="w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>;
}
function CalIcon() {
  return <svg className="w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2}/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/></svg>;
}
function PersonIcon() {
  return <svg className="w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>;
}

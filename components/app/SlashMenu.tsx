"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Type, Heading1, Heading2, Heading3, List, ListOrdered,
  CheckSquare, Quote, Code, Minus, AlertCircle, Image,
} from "lucide-react";

export interface SlashCommand {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  description: string;
  action: () => void;
}

interface SlashMenuProps {
  commands: SlashCommand[];
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function SlashMenu({ commands, onClose, position }: SlashMenuProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered, selectedIndex, onClose]
  );

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] bg-[var(--bg)] rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[var(--border)] w-[320px] overflow-hidden"
      style={{
        top: position ? `${position.top}px` : "auto",
        left: position ? `${position.left}px` : "auto",
      }}
    >
      {/* Search input */}
      <div className="px-3 py-2 border-b border-[var(--border)]">
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Filter actions..."
          className="w-full text-[13px] outline-none text-[var(--text)] placeholder-[#c7c5c2] bg-transparent"
        />
      </div>

      {/* Command list */}
      <div className="py-1 max-h-[320px] overflow-y-auto">
        <div className="px-3 py-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Basic blocks
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-3 py-4 text-[13px] text-[var(--text-secondary)] text-center">No results</div>
        ) : (
          filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`w-full flex items-center gap-3 px-3 py-[7px] text-left transition-colors ${
                i === selectedIndex ? "bg-[var(--bg-secondary)]" : "hover:bg-[var(--bg-secondary)]"
              }`}
              onClick={() => {
                cmd.action();
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <div className="w-[42px] h-[42px] rounded-md border border-[var(--border)] flex items-center justify-center shrink-0 bg-[var(--bg)]">
                <cmd.icon className="w-[18px] h-[18px]" style={{ color: "#37352f" }} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-[var(--text)]">{cmd.label}</div>
                <div className="text-[11px] text-[var(--text-secondary)] truncate">{cmd.description}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// Export default command definitions (icons)
export const defaultSlashIcons = {
  text: Type,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  bullet: List,
  numbered: ListOrdered,
  todo: CheckSquare,
  quote: Quote,
  code: Code,
  divider: Minus,
  callout: AlertCircle,
  image: Image,
};

"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section style={{ textAlign: "center", padding: "80px 24px 64px", maxWidth: "1000px", margin: "0 auto" }}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: "clamp(48px, 7vw, 72px)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: "#37352f",
          marginBottom: "24px",
        }}
      >
        The happier workspace
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          fontSize: "20px",
          color: "#787774",
          marginBottom: "32px",
          maxWidth: "540px",
          margin: "0 auto 32px",
          lineHeight: 1.6,
        }}
      >
        Notion is the connected workspace where better, faster work happens.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "64px" }}
      >
        <Link
          href="/app/getting-started"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#2383e2",
            color: "white",
            fontWeight: 500,
            borderRadius: "8px",
            fontSize: "15px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          Get Notion free →
        </Link>
        <button
          style={{
            padding: "12px 24px",
            color: "#37352f",
            fontWeight: 500,
            fontSize: "15px",
            background: "transparent",
            border: "1px solid #e9e9e7",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Request a demo
        </button>
      </motion.div>

      {/* Mock Product Screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        style={{
          borderRadius: "16px",
          border: "1px solid #e9e9e7",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
          background: "white",
        }}
      >
        <div style={{ display: "flex", height: "480px" }}>
          {/* Sidebar mock */}
          <div style={{
            width: "200px",
            background: "#f7f6f3",
            borderRight: "1px solid #e9e9e7",
            padding: "12px",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", marginBottom: "12px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "linear-gradient(135deg, #2383e2, #9065b0)", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#37352f" }}>Milan&apos;s Workspace</span>
            </div>
            {[
              { icon: "🔍", label: "Search" },
              { icon: "🏠", label: "Home" },
              { icon: "📥", label: "Inbox" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 8px", borderRadius: "6px", marginBottom: "2px" }}>
                <span style={{ fontSize: "13px" }}>{item.icon}</span>
                <span style={{ fontSize: "12px", color: "#37352f" }}>{item.label}</span>
              </div>
            ))}
            <div style={{ marginTop: "16px", marginBottom: "6px", padding: "0 8px" }}>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#787774", textTransform: "uppercase", letterSpacing: "0.05em" }}>Favorites</span>
            </div>
            {["🚀 Getting Started", "📋 Product Roadmap", "📝 Meeting Notes", "📖 Team Wiki"].map((p) => (
              <div key={p} style={{ display: "flex", alignItems: "center", padding: "5px 8px", borderRadius: "6px", marginBottom: "2px" }}>
                <span style={{ fontSize: "12px", color: "#37352f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p}</span>
              </div>
            ))}
          </div>

          {/* Content mock */}
          <div style={{ flex: 1, padding: "40px 48px", textAlign: "left", overflow: "hidden" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px", lineHeight: 1 }}>🚀</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#37352f", marginBottom: "16px" }}>Getting Started</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[100, 88, 95, 72].map((w, i) => (
                <div key={i} style={{ height: "11px", background: "#e9e9e7", borderRadius: "4px", width: `${w}%` }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[
                { label: "📄 Docs", bg: "#e7f3fb" },
                { label: "📊 Database", bg: "#fff3e0" },
                { label: "✅ Tasks", bg: "#e8f5e9" },
              ].map((card) => (
                <div key={card.label} style={{ background: card.bg, borderRadius: "8px", padding: "12px", border: "1px solid #e9e9e7" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#37352f", marginBottom: "8px" }}>{card.label}</div>
                  <div style={{ height: "8px", background: "#d9d9d7", borderRadius: "3px", marginBottom: "6px", width: "75%" }} />
                  <div style={{ height: "8px", background: "#d9d9d7", borderRadius: "3px", width: "50%" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

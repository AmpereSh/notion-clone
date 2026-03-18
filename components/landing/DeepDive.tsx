"use client";
import { motion } from "framer-motion";

function MockWiki() {
  return (
    <div style={{ background: "white", border: "1px solid #e9e9e7", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", overflow: "hidden", width: "100%", maxWidth: "460px" }}>
      <div style={{ display: "flex", height: "220px" }}>
        <div style={{ width: "140px", background: "#f7f6f3", borderRight: "1px solid #e9e9e7", padding: "12px", flexShrink: 0 }}>
          {["📖 Team Wiki", "📋 Roadmap", "💡 Ideas", "✅ Tasks", "📝 Notes"].map((p) => (
            <div key={p} style={{ fontSize: "11px", color: "#37352f", padding: "4px 8px", borderRadius: "4px", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>📖</div>
          <div style={{ height: "18px", background: "#37352f", borderRadius: "4px", width: "110px", marginBottom: "12px" }} />
          {[92, 78, 85, 65, 70].map((w, i) => (
            <div key={i} style={{ height: "9px", background: "#e9e9e7", borderRadius: "3px", marginBottom: "8px", width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MockEditor() {
  return (
    <div style={{ background: "white", border: "1px solid #e9e9e7", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", overflow: "hidden", width: "100%", maxWidth: "460px" }}>
      <div style={{ padding: "24px", height: "220px" }}>
        <div style={{ fontSize: "24px", marginBottom: "8px" }}>✍️</div>
        <div style={{ height: "20px", background: "#37352f", borderRadius: "4px", width: "180px", marginBottom: "16px" }} />
        <div style={{ height: "10px", background: "#e9e9e7", borderRadius: "3px", width: "100%", marginBottom: "8px" }} />
        <div style={{ height: "10px", background: "#e9e9e7", borderRadius: "3px", width: "85%", marginBottom: "10px" }} />
        <div style={{ height: "38px", background: "#e7f3fb", borderRadius: "6px", width: "100%", display: "flex", alignItems: "center", padding: "0 12px", marginBottom: "10px" }}>
          <span style={{ fontSize: "11px", color: "#2383e2", fontWeight: 500 }}>💡 This is a callout block</span>
        </div>
        <div style={{ height: "10px", background: "#e9e9e7", borderRadius: "3px", width: "80%" }} />
      </div>
    </div>
  );
}

function MockDatabase() {
  return (
    <div style={{ background: "white", border: "1px solid #e9e9e7", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", overflow: "hidden", width: "100%", maxWidth: "460px" }}>
      <div style={{ height: "220px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: "1px solid #e9e9e7", background: "#f7f6f3", padding: "8px 12px" }}>
          {["Name", "Status", "Priority", "Due"].map((h) => (
            <div key={h} style={{ fontSize: "11px", fontWeight: 600, color: "#787774" }}>{h}</div>
          ))}
        </div>
        {[
          ["Launch v2.0", "✅ Done", "🔴 High", "Mar 15"],
          ["Fix bug #234", "🔄 In Progress", "🟠 Med", "Mar 18"],
          ["Update docs", "⬜ Not Started", "🟢 Low", "Mar 20"],
          ["Design review", "🔄 In Progress", "🔴 High", "Mar 17"],
          ["API refactor", "⬜ Not Started", "🟠 Med", "Mar 22"],
        ].map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: "1px solid #e9e9e7", padding: "7px 12px" }}>
            {row.map((cell, j) => (
              <div key={j} style={{ fontSize: "11px", color: "#37352f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const sections = [
  {
    title: "Your wiki, docs, & projects. Together.",
    desc: "Notion replaces every tool your team is juggling. Stop switching between apps and bring everything into one connected workspace.",
    mock: <MockWiki />,
    reverse: false,
  },
  {
    title: "Build any page, visually.",
    desc: "Start with a blank page and build exactly what you need — meeting notes, product specs, company handbooks. Drag and drop blocks with no code needed.",
    mock: <MockEditor />,
    reverse: true,
  },
  {
    title: "Powerful building blocks.",
    desc: "Databases, boards, calendars, and 50+ block types snap together to create exactly the workflow you need. Filter, sort, and view your data any way you like.",
    mock: <MockDatabase />,
    reverse: false,
  },
];

export default function DeepDive() {
  return (
    <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      {sections.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "64px",
            flexDirection: s.reverse ? "row-reverse" : "row",
            marginBottom: i < sections.length - 1 ? "100px" : 0,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, color: "#37352f", marginBottom: "16px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              {s.title}
            </h2>
            <p style={{ fontSize: "16px", color: "#787774", lineHeight: 1.7, marginBottom: "20px" }}>{s.desc}</p>
            <button style={{ color: "#2383e2", fontWeight: 500, fontSize: "15px", background: "none", border: "none", cursor: "pointer" }}>
              Learn more →
            </button>
          </div>
          <div style={{ flex: 1, minWidth: "280px", display: "flex", justifyContent: "center" }}>
            {s.mock}
          </div>
        </motion.div>
      ))}
    </section>
  );
}

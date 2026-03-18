"use client";
import { motion } from "framer-motion";

const features = [
  {
    emoji: "📖",
    color: "#ffa344",
    bg: "#fff3e0",
    title: "Wikis",
    desc: "Centralize your knowledge. No more searching across tools — everything your team needs is in one place.",
  },
  {
    emoji: "📄",
    color: "#2383e2",
    bg: "#e7f3fb",
    title: "Docs",
    desc: "Write, edit, and collaborate on beautiful documents. From meeting notes to product specs — all in real time.",
  },
  {
    emoji: "📋",
    color: "#4dab9a",
    bg: "#eefaf6",
    title: "Projects",
    desc: "Manage any type of project. Assign tasks, set timelines, and track progress — all in one flexible workspace.",
  },
  {
    emoji: "📅",
    color: "#9065b0",
    bg: "#f5eefb",
    title: "Calendar",
    desc: "See all your work in a time-based view. Plan your schedule and never miss a deadline again.",
  },
];

export default function Features() {
  return (
    <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: "56px" }}
      >
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#37352f", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          One place for all your work
        </h2>
        <p style={{ fontSize: "17px", color: "#787774", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
          Every tool you need to organize and create, all in one workspace.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            style={{
              border: "1px solid #e9e9e7",
              borderRadius: "12px",
              padding: "24px",
              background: "white",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
          >
            <div style={{
              width: "44px", height: "44px", borderRadius: "10px",
              background: f.bg, display: "flex", alignItems: "center",
              justifyContent: "center", marginBottom: "16px", fontSize: "22px",
            }}>
              {f.emoji}
            </div>
            <h3 style={{ fontWeight: 600, color: "#37352f", fontSize: "17px", marginBottom: "8px" }}>{f.title}</h3>
            <p style={{ fontSize: "14px", color: "#787774", lineHeight: 1.6 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

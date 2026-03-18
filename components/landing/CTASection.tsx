"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section style={{ background: "#f7f6f3", padding: "80px 24px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "580px", margin: "0 auto", textAlign: "center" }}
      >
        <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: "#37352f", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Get started for free
        </h2>
        <p style={{ fontSize: "17px", color: "#787774", marginBottom: "32px", lineHeight: 1.6 }}>
          Play around with it first. Pay and add your team later.
        </p>
        <Link
          href="/app/getting-started"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "#2383e2",
            color: "white",
            fontWeight: 500,
            borderRadius: "8px",
            fontSize: "15px",
            textDecoration: "none",
          }}
        >
          Get Notion free →
        </Link>
        <p style={{ fontSize: "13px", color: "#787774", marginTop: "16px" }}>For individuals. Free forever.</p>
      </motion.div>
    </section>
  );
}

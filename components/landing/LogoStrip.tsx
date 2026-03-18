"use client";
import { motion } from "framer-motion";

const companies = [
  { name: "Figma",      domain: "figma.com" },
  { name: "GitHub",     domain: "github.com" },
  { name: "Uber",       domain: "uber.com" },
  { name: "Nike",       domain: "nike.com" },
  { name: "Headspace",  domain: "headspace.com" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "Amazon",     domain: "amazon.com" },
  { name: "Stripe",     domain: "stripe.com" },
];

const faviconUrl = (domain: string) =>
  `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;

export default function LogoStrip() {
  return (
    <section style={{ padding: "40px 24px", borderTop: "1px solid #e9e9e7", borderBottom: "1px solid #e9e9e7" }}>
      <p style={{ textAlign: "center", fontSize: "13px", color: "#787774", marginBottom: "28px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
        Trusted by teams at
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", flexWrap: "wrap", maxWidth: "900px", margin: "0 auto" }}>
        {companies.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.15 }}
            style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.45, cursor: "pointer", transition: "opacity 0.2s" }}
          >
            <img
              src={faviconUrl(c.domain)}
              alt={c.name}
              style={{ width: "28px", height: "28px", objectFit: "contain", filter: "grayscale(100%)" }}
            />
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#787774" }}>{c.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

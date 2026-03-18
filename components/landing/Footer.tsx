import Link from "next/link";

const footerCols = [
  { title: "Company",    links: ["About us", "Careers", "Blog", "Press", "Media Kit"] },
  { title: "Download",   links: ["iOS & Android", "Mac & Windows", "Web Clipper", "API"] },
  { title: "Resources",  links: ["Help center", "Pricing", "Blog", "Community", "Integrations", "Templates"] },
  { title: "Notion for", links: ["Enterprise", "Small Business", "Personal", "Remote Work", "Startups", "Education"] },
];

const bottomLinks = ["Privacy Policy", "Terms & Conditions", "Security", "Status", "Cookie settings"];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link { font-size: 13px; color: #787774; text-decoration: none; transition: color 0.15s; }
        .footer-link:hover { color: #37352f; }
        .footer-bottom-link { font-size: 12px; color: #787774; text-decoration: none; white-space: nowrap; transition: color 0.15s; }
        .footer-bottom-link:hover { color: #37352f; }
        .footer-social { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:1px solid #e0dfdc; border-radius:50%; font-size:12px; color:#787774; text-decoration:none; transition: color 0.15s, border-color 0.15s; }
        .footer-social:hover { color:#37352f; border-color:#aaa; }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 580px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-bottom { flex-direction: column; align-items: flex-start !important; }
        }
      `}</style>

      <footer style={{
        borderTop: "1px solid #e9e9e7",
        background: "#ffffff",
        padding: "64px 24px 40px",
        width: "100%",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Main grid */}
          <div className="footer-grid" style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
            gap: "40px 32px",
            marginBottom: "48px",
          }}>

            {/* Brand column */}
            <div className="footer-brand">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                  <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94C.967 76.827 0 74.497 0 71.773V11.113c0-3.497 1.553-6.413 6.017-6.8z" fill="white"/>
                  <path d="M61.35.227L6.017 4.314C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.433-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.873-2.847-3.443-4.733L74.167 3.14C69.893.04 68.147-.353 61.35.227z" fill="#37352F"/>
                </svg>
                <span style={{ fontWeight: 600, color: "#37352f", fontSize: "15px" }}>Notion</span>
              </div>
              <p style={{ fontSize: "13px", color: "#787774", lineHeight: "1.65", marginBottom: "16px", maxWidth: "200px" }}>
                The connected workspace for your wiki, docs, and projects.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {[{ l: "𝕏", t: "X" }, { l: "in", t: "LinkedIn" }, { l: "▶", t: "YouTube" }].map((s) => (
                  <a key={s.t} href="#" title={s.t} className="footer-social">{s.l}</a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerCols.map((col) => (
              <div key={col.title}>
                <div style={{ fontWeight: 600, color: "#37352f", fontSize: "11px", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {col.title}
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="footer-link">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom" style={{
            borderTop: "1px solid #e9e9e7",
            paddingTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}>
            <p style={{ fontSize: "12px", color: "#787774", margin: 0 }}>© 2024 Notion Labs, Inc.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
              {bottomLinks.map((t) => (
                <Link key={t} href="#" className="footer-bottom-link">{t}</Link>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function NotionLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94C.967 76.827 0 74.497 0 71.773V11.113c0-3.497 1.553-6.413 6.017-6.8z" fill="white"/>
      <path d="M61.35.227L6.017 4.314C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.433-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.873-2.847-3.443-4.733L74.167 3.14C69.893.04 68.147-.353 61.35.227zM25.333 19.327c-5.067.31-6.207.38-9.1-1.82L8.2 11.207c-.78-.78-.39-1.75 1.36-1.943l51.06-3.693c4.467-.39 6.793 1.167 8.543 2.527l9.72 7.04c.39.197 1.36 1.36.193 1.36l-52.773 3.05-.97-.22zM19.66 88.3V36.267c0-2.527.78-3.693 3.113-3.89l56.377-3.313c2.14-.193 3.107 1.167 3.107 3.693v51.453c0 2.527-.387 4.667-3.5 4.86l-53.897 3.117c-3.113.193-4.587-.973-4.587-3.887h-.613zM73.37 36.073c.387 1.75 0 3.5-1.75 3.7l-2.723.58v38.073c-2.333 1.36-4.473 2.14-6.22 2.14-2.917 0-3.693-.78-5.833-3.307L38.617 49.493v25.687l5.637 1.363s0 3.5-4.86 3.5l-13.397.78c-.39-.78 0-2.723 1.357-3.11l3.5-.973V42.143l-4.86-.39c-.39-1.75.58-4.277 3.3-4.473l14.367-.967 19.247 29.447V41.703l-4.667-.583c-.39-2.143 1.163-3.7 3.103-3.89l13.77-.78z" fill="#37352F"/>
    </svg>
  );
}

const NAV_ITEMS = ["Product", "Download", "Solutions", "Resources", "Pricing"];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (scrolled && mobileOpen) setMobileOpen(false);
  }, [scrolled]);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-center { display: none !important; }
          .nav-right-full { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-cta-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
          .nav-cta-mobile { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>

      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(8px)",
        borderBottom: scrolled ? "1px solid #e9e9e7" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.05)" : "none",
        transition: "all 0.2s",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
          height: "56px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "16px",
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
            <NotionLogo />
            <span style={{ fontWeight: 600, color: "#37352f", fontSize: "17px" }}>Notion</span>
          </Link>

          {/* Center nav — hidden on mobile */}
          <nav className="nav-center" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {NAV_ITEMS.map((item) => (
              <button key={item} style={{
                padding: "6px 12px", fontSize: "14px", color: "#37352f",
                background: "none", border: "none", borderRadius: "6px",
                cursor: "pointer", fontWeight: 400,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0ef")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right CTAs — hidden on mobile */}
          <div className="nav-right-full" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <button style={{ padding: "6px 12px", fontSize: "14px", color: "#37352f", background: "none", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Request a demo
            </button>
            <Link href="/app/getting-started" style={{ padding: "6px 12px", fontSize: "14px", color: "#37352f", textDecoration: "none", borderRadius: "6px" }}>
              Log in
            </Link>
            <Link href="/app/getting-started" style={{
              padding: "7px 16px", fontSize: "14px", fontWeight: 500,
              color: "white", background: "#37352f", borderRadius: "7px",
              textDecoration: "none",
            }}>
              Get Notion free
            </Link>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/app/getting-started"
              className="nav-cta-mobile"
              style={{
                display: "none", padding: "6px 14px", fontSize: "13px",
                fontWeight: 500, color: "white", background: "#37352f",
                borderRadius: "7px", textDecoration: "none",
              }}
            >
              Get free
            </Link>

            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none", flexDirection: "column", gap: "5px",
                padding: "6px", background: "none", border: "none",
                cursor: "pointer", borderRadius: "6px",
              }}
              aria-label="Toggle menu"
            >
              <span style={{ width: "20px", height: "2px", background: "#37352f", borderRadius: "2px", display: "block", transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ width: "20px", height: "2px", background: "#37352f", borderRadius: "2px", display: "block", transition: "all 0.2s", opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ width: "20px", height: "2px", background: "#37352f", borderRadius: "2px", display: "block", transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className="nav-mobile-menu"
          style={{
            display: mobileOpen ? "block" : "none",
            borderTop: "1px solid #e9e9e7",
            background: "rgba(255,255,255,0.98)",
            padding: "8px 16px 16px",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button key={item} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "10px 8px", fontSize: "15px", color: "#37352f",
              background: "none", border: "none", borderRadius: "6px",
              cursor: "pointer", borderBottom: "1px solid #f5f5f4",
            }}>
              {item}
            </button>
          ))}
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button style={{ padding: "8px", fontSize: "14px", color: "#37352f", background: "none", border: "1px solid #e9e9e7", borderRadius: "7px", cursor: "pointer" }}>
              Request a demo
            </button>
            <Link href="/app/getting-started" style={{ padding: "10px", fontSize: "14px", color: "#37352f", textDecoration: "none", borderRadius: "7px", border: "1px solid #e9e9e7", textAlign: "center" }}>
              Log in
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

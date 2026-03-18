"use client";
import FirestoreProvider from "@/components/app/FirestoreProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirestoreProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </div>
    </FirestoreProvider>
  );
}

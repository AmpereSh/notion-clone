"use client";
import { use } from "react";
import Sidebar from "@/components/app/Sidebar";
import Editor from "@/components/app/Editor";

export default function AppPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = use(params);
  return (
    <>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)", color: "var(--text)" }}>
        <Editor pageId={pageId} />
      </main>
    </>
  );
}

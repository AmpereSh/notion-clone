"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function AppIndex() {
  const router = useRouter();
  const { pages, currentPageId } = useAppStore();

  useEffect(() => {
    // Navigate to current page or first available page
    const target = currentPageId || pages[0]?.id || "getting-started";
    router.replace(`/app/${target}`);
  }, []);

  // Blank while redirecting — layout provides the shell
  return null;
}

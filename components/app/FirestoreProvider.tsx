"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

export default function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const { subscribeToFirestore, darkMode } = useAppStore();
  const subscribed = useRef(false);

  useEffect(() => {
    // Apply theme immediately on mount
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");

    // Only subscribe once — prevents double-subscribe during Turbopack HMR or strict mode
    if (subscribed.current) return;
    subscribed.current = true;

    const unsub = subscribeToFirestore();
    return () => {
      subscribed.current = false;
      unsub();
    };
  }, []);

  return <>{children}</>;
}

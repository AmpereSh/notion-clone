import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notion – The happier workspace",
  description: "Notion is the connected workspace where better, faster work happens.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

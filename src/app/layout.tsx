import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Kollect",
  description: "Influencer Marketing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}

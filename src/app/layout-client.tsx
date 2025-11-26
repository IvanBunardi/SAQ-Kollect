'use client';

import { LanguageProvider } from "@/src/components/LanguageProvider";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
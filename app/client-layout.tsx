// client-layout.tsx
"use client";

import DynamicTitle from "@/components/ui/dynamicTitle";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-[100dvh]">
      <DynamicTitle />
      <main className="bg-gray-50 flex-grow overflow-auto">{children}</main>
    </div>
  );
}

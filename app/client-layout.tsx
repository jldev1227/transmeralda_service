// client-layout.tsx
"use client";

// import Navbar from "@/components/ui/navbar";
import DynamicTitle from "@/components/ui/dynamicTitle";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      <DynamicTitle />
      <main className="bg-gray-50 flex-grow">{children}</main>
    </div>
  );
}

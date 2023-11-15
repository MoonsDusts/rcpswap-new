"use client";

import { DerivedSwapStateProvider } from "@/state/swap/hooks";

export function Providers({ children }: { children: React.ReactNode }) {
  return <DerivedSwapStateProvider>{children}</DerivedSwapStateProvider>;
}

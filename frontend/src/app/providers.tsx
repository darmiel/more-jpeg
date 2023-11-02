"use client"

import { SearchProvider } from "@/context/SearchContext"
import { NextUIProvider } from "@nextui-org/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SearchProvider>{children}</SearchProvider>
    </NextUIProvider>
  )
}

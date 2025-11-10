"use client"

import { useTheme } from "next-themes"
import { Toaster } from "sonner"

export function ToasterClient() {
  const { theme } = useTheme()
  return <Toaster theme={theme} />
}

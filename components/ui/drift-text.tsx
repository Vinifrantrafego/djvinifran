"use client"

import { cn } from "@/lib/utils"

interface DriftTextProps {
  children: React.ReactNode
  /** Delay inicial em segundos — use valores diferentes para cada elemento não ficarem em sincronia */
  delay?: number
  /** Duração de um ciclo em segundos */
  duration?: number
  className?: string
}

export function DriftText({
  children,
  delay = 0,
  duration = 8,
  className,
}: DriftTextProps) {
  return (
    <span
      className={cn("inline-block", className)}
      style={{
        animation: `text-drift ${duration}s ease-in-out ${delay}s infinite alternate`,
        willChange: "transform",
      }}
    >
      {children}
    </span>
  )
}

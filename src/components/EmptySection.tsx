'use client'

import { Button } from '@/components/ui/button'
import { Inbox, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptySectionProps {
  title?: string
  description?: string
  icon?: LucideIcon
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  children?: ReactNode
}

export function EmptySection({
  title,
  description,
  icon: Icon,
  primaryAction,
  secondaryAction,
  children,
}: EmptySectionProps) {
  return (
    <section className="bg-background px-4 py-6 md:px-6">
      <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-dashed p-6">
        {Icon && (
          <div className="bg-card flex h-12 w-12 items-center justify-center rounded-md border p-2 shadow-sm">
            <Icon className="text-foreground h-6 w-6" />
          </div>
        )}

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-foreground text-lg font-semibold md:text-xl">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-sm leading-5">
              {description}
            </p>
          )}
        </div>

        {children || (
          <div className="flex w-full flex-col items-stretch justify-center gap-3 md:flex-row md:items-center">
            {primaryAction && (
              <Button onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

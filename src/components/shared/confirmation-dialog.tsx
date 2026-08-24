"use client"

import type { ReactElement, ReactNode } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ConfirmationDialogProps = {
  cancelLabel?: string
  children?: ReactNode
  confirmLabel: string
  destructive?: boolean
  disabled?: boolean
  description: ReactNode
  onConfirm?: () => void
  title: ReactNode
  trigger: ReactElement
}

function ConfirmationDialog({
  cancelLabel = "Cancel",
  children,
  confirmLabel,
  destructive = false,
  disabled,
  description,
  onConfirm,
  title,
  trigger,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={disabled}
            variant={destructive ? "destructive" : "secondary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmationDialog, type ConfirmationDialogProps }

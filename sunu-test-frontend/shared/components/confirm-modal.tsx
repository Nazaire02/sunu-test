import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialogue'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  onConfirm: () => void
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: 'text-primary',
    actionClass: 'bg-primary hover:bg-primary/90'
  },
  destructive: {
    icon: XCircle,
    iconClass: 'text-destructive',
    actionClass: 'bg-destructive hover:bg-destructive/90'
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-emerald-600',
    actionClass: 'bg-emerald-600 hover:bg-emerald-600/90'
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-600',
    actionClass: 'bg-amber-600 hover:bg-amber-600/90'
  }
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  onConfirm
}: ConfirmationDialogProps) => {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-muted ${config.iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="ml-12">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={config.actionClass}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
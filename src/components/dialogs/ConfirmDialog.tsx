import { createPortal } from "react-dom"

type ConfirmDialogProps = {
  open: boolean
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmDialog = ({
  open,
  title = 'Konfirmasi',
  description,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  confirmVariant = 'primary',
  onClose,
  onConfirm,
}: ConfirmDialogProps) => {
  if (!open) return null

  const confirmClass =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-blue-600 hover:bg-blue-700'

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h3 className="font-semibold mb-2">{title}</h3>

        {description && (
          <div className="text-sm text-gray-600 mb-4">
            {description}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md cursor-pointer border hover:bg-gray-50"
          >
            {cancelText}
          </button>

          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-3 py-1.5 text-sm rounded-md cursor-pointer text-white ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

import type { ReactNode } from 'react'

type ModalProps = {
  labelledBy: string
  onClose: () => void
  className?: string
  children: ReactNode
}

export function Modal({ labelledBy, onClose, className, children }: ModalProps) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <section
        className={className ? `login-modal ${className}` : 'login-modal'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <button className="close-button" aria-label="Funga" onClick={onClose}>
          ×
        </button>
        {children}
      </section>
    </div>
  )
}

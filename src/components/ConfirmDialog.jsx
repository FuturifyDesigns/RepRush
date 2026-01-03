export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 animate-scaleIn">
        {/* Icon */}
        <div className="p-6 pb-4">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-300 text-center text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium transition-all"
          >
            Keep Editing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}

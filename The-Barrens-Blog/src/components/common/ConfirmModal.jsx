import { useEffect } from "react";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  type = "danger",
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const colorScheme =
    type === "danger"
      ? {
          bg: "bg-red-900/30",
          border: "border-red-800",
          icon: "text-red-500",
          confirmBtn:
            "from-red-700 to-red-900 border-red-600 hover:from-red-600 hover:to-red-800",
        }
      : {
          bg: "bg-amber-900/30",
          border: "border-amber-800",
          icon: "text-amber-500",
          confirmBtn:
            "from-amber-700 to-amber-900 border-amber-600 hover:from-amber-600 hover:to-amber-800",
        };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className={`${colorScheme.bg} border-2 ${colorScheme.border} rounded-lg shadow-xl max-w-md w-full animate-fadeIn`}
        onClick={handleModalClick}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`${colorScheme.icon} mr-4`}>
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-amber-300">{title}</h3>
          </div>

          <p className="text-amber-100 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-b from-slate-700 to-slate-900 text-amber-200 rounded border border-slate-600 hover:from-slate-600 hover:to-slate-800 cursor-pointer transition-all duration-300 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 bg-gradient-to-b ${colorScheme.confirmBtn} text-white rounded border transition-all duration-300 disabled:opacity-50 flex items-center hover:cursor-pointer`}
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

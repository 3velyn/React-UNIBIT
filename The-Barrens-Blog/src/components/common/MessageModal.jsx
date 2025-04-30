import { useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function MessageModal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  autoClose = false,
  autoCloseTime = 8000,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);

      let timer;
      if (autoClose) {
        timer = setTimeout(() => {
          onClose();
        }, autoCloseTime);
      }

      return () => {
        window.removeEventListener("keydown", handleEsc);
        if (timer) clearTimeout(timer);
      };
    }
  }, [isOpen, onClose, autoClose, autoCloseTime]);

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const colorScheme =
    type === "success"
      ? {
          bg: "bg-green-900/30",
          border: "border-green-800",
          icon: "text-green-500",
          button:
            "from-green-700 to-green-900 border-green-600 hover:from-green-600 hover:to-green-800",
        }
      : {
          bg: "bg-red-900/30",
          border: "border-red-800",
          icon: "text-red-500",
          button:
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className={`${colorScheme.icon} mr-4`}>
                {type === "success" ? (
                  <FaCheckCircle size={24} />
                ) : (
                  <FaExclamationTriangle size={24} />
                )}
              </div>
              <h3 className="text-xl font-bold text-amber-300">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-amber-400 hover:text-amber-300 transition-colors hover:cursor-pointer"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <p className="text-amber-100 mb-6">{message}</p>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 bg-gradient-to-b ${colorScheme.button} text-amber-200 rounded border transition-all duration-300 hover:cursor-pointer`}
            >
              {type === "success" ? "Continue" : "OK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

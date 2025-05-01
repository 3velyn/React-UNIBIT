import { useEffect, useState } from "react";
import { changeAvatar } from "../../api/user";
import { FaTimes, FaImage, FaSpinner, FaCheck } from "react-icons/fa";

export default function AvatarModal({
  show,
  onClose,
  currentAvatar,
  onAvatarUpdate,
}) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show && currentAvatar) {
      setAvatarUrl(currentAvatar);
    }
  }, [show, currentAvatar]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      setError("");

      if (!avatarUrl) {
        setError("Please enter an avatar URL");
        return;
      }

      if (!validateUrl(avatarUrl)) {
        setError("Please enter a valid URL");
        return;
      }

      setLoading(true);
      const response = await changeAvatar(avatarUrl);

      if (response.success) {
        setSuccess(true);

        if (onAvatarUpdate) {
          onAvatarUpdate(avatarUrl);
        }

        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to update avatar:", err);
      setError(err.response?.data?.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-700 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-amber-300">Change Avatar</h3>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-amber-300 text-sm font-medium mb-2">
            Avatar URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaImage className="text-amber-600" />
            </div>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => {
                setAvatarUrl(e.target.value);
                setError("");
              }}
              placeholder="https://example.com/your-avatar.jpg"
              className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        {avatarUrl && (
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-600">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-amber-700/50 text-amber-300 rounded-md mr-3 hover:bg-amber-900/30 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateAvatar}
            disabled={loading || success}
            className="px-4 py-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 cursor-pointer hover:to-amber-800 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Updating...
              </>
            ) : success ? (
              <>
                <FaCheck className="mr-2" />
                Updated!
              </>
            ) : (
              "Update Avatar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

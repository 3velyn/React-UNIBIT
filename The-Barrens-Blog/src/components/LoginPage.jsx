import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import barrensBackground from "../assets/Barrens_CGI.webp";
import { FaEnvelope, FaLock, FaExclamationTriangle } from "react-icons/fa";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const { loginUser, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (email) {
      const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!pattern.test(email)) {
        setFormError("Invalid email! (exam-ple@example.exa)");
        return;
      }
    }

    try {
      const response = await loginUser(formData);
      console.log("Login successful: ", response);
      navigate("/");
    } catch (error) {
      console.error("Login error: ", error);
      setFormError(
        error.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="h-[calc(100vh-6em)] flex items-center justify-center font-serif overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
        style={{
          backgroundImage: `url(${barrensBackground})`,
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 z-0"></div>

      <div className="relative z-10 max-w-md w-full px-6">
        <div className="border-2 border-amber-700 rounded-lg overflow-hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-xl">
          <div className="p-6 border-b border-amber-700/30">
            <div className="flex items-center justify-center mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WoW_icon.svg/800px-WoW_icon.svg.png"
                alt="The Barrens Blog"
                className="h-14 mr-3 rounded shadow-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-center text-amber-300 font-serif tracking-wide uppercase">
              Login to Your Account
            </h1>
          </div>

          {(error || formError) && (
            <div className="mx-6 mt-4 p-3 bg-red-900/30 border border-red-800 rounded flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <span className="text-red-200 text-sm">{error || formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-amber-600" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-amber-600" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white transition-all duration-300 font-medium uppercase tracking-wide text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-amber-100/70 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

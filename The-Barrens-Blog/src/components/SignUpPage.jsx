import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import barrensBackground from "../assets/Barrens_CGI.webp";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaPhotoVideo,
} from "react-icons/fa";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { registerUser, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Password do not match");
      return;
    }

    try {
      await registerUser({ username, email, avatar, password });
      console.log("User registered successfully");
      navigate("/login");
    } catch (error) {
      setFormError(error.message || "Registration failed. Please try again.");
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
          <div className="p-5 border-b border-amber-700/30">
            <div className="flex items-center justify-center mb-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WoW_icon.svg/800px-WoW_icon.svg.png"
                alt="The Barrens Blog"
                className="h-12 mr-3 rounded shadow-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-center text-amber-300 font-serif tracking-wide uppercase">
              Join the Guild
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="space-y-3">
              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-amber-600" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Avatar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhotoVideo className="text-amber-600" />
                  </div>
                  <input
                    type="avatar"
                    name="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Avatar URL"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Choose a strong password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaShieldAlt className="text-amber-600" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Verify your password"
                    required
                  />
                </div>
              </div>
            </div>

            {(error || formError) && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mt-3">
                {error || formError}
              </div>
            )}

            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white transition-all duration-300 font-medium uppercase tracking-wide text-sm disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-amber-100/70 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

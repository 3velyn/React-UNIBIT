import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import barrensBackground from "../assets/Barrens_CGI.webp";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-6em)] py-8 px-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
        style={{ backgroundImage: `url(${barrensBackground})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 z-0"></div>

      <div className="container mx-auto max-w-4xl relative z-10 h-full flex flex-col items-center justify-center text-center py-16">
        <div className="border-2 border-amber-700 rounded-lg overflow-hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-xl p-8 max-w-xl w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-red-900/30 p-6 rounded-full border-2 border-red-700/50">
              <FaExclamationTriangle className="text-red-500 text-6xl" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-amber-300 font-serif tracking-wide mb-4">
            404 - Page Not Found
          </h1>

          <p className="text-amber-200/80 text-lg mb-6">
            By the Light of Elune! This page seems to have been lost in the
            Twisting Nether.
          </p>

          <p className="text-amber-200/70 mb-8 italic">
            "Not all who wander are lost, but this page definitely is."
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 flex items-center font-medium"
            >
              <FaHome className="mr-2" />
              Return to Homestead
            </Link>
          </div>

          <div className="mt-6 text-amber-400/60 text-sm">
            Perhaps you should check the map coordinates or speak with a flight
            master.
          </div>
        </div>
      </div>
    </div>
  );
}

import { FaSpinner } from "react-icons/fa";
import barrensBackground from "../../assets/Barrens_CGI.webp";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${barrensBackground})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90"></div>

      <div className="relative z-10 text-center">
        <div className="w-24 h-24 mx-auto mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WoW_icon.svg/800px-WoW_icon.svg.png"
            alt="WoW Blog"
            className="w-full h-full object-contain animate-pulse"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
            }}
          />
        </div>
        <FaSpinner className="animate-spin text-amber-500 text-5xl mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-amber-300 font-serif tracking-wide">
          Loading the realm...
        </h2>
        <p className="text-amber-200/60 mt-2">Summoning your character data</p>
      </div>
    </div>
  );
}

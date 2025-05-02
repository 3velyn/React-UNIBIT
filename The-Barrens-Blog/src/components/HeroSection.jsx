import { FaDiscord, FaTwitter } from "react-icons/fa";
import barrensBackground from "../assets/Barrens_CGI.webp";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url(${barrensBackground})`,
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-20 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-amber-300 mb-3 font-serif uppercase drop-shadow-lg shadow-amber-500/40">
            The Barrens Blog
          </h1>

          <p className="text-amber-100 text-lg mb-6 leading-relaxed">
            Your source for World of Warcraft guides, news, and community
            stories
          </p>


        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-amber-900/30 via-amber-600/20 to-amber-900/30"></div>
    </div>
  );
}
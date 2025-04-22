import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import barrensBackground from "../assets/Barrens_CGI.webp";

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-amber-700">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url(${barrensBackground})`,
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-600/90 to-slate-900/90"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WoW_icon.svg/800px-WoW_icon.svg.png"
              alt="The Barrens Blog"
              className="h-10 inline-block mr-3 rounded shadow-lg"
            />
            <span className="text-amber-300 text-lg font-bold">
              The Barrens Blog
            </span>
          </div>

          <div className="text-center md:text-right">
            <div className="flex space-x-4 justify-center md:justify-end mb-4">
              <a
                href="#"
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                <FaDiscord size={20} />
              </a>
              <a
                href="#"
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
            </div>
            <p className="text-amber-100/60 text-sm">
              © 2025 The Barrens Blog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
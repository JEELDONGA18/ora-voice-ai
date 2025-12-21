import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  /* CURSOR GLOW */
  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsDesktop(mq.matches);
    mq.addEventListener("change", (e) => setIsDesktop(e.matches));
  }, []);

  const linkClass = ({ isActive }) =>
    `text-lg transition ${
      isActive ? "text-green-400" : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="relative min-h-screen bg-[#0B0B0F] text-white flex flex-col">

      {/* CURSOR GLOW (DESKTOP ONLY) */}
      {isDesktop && (
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: `radial-gradient(600px at ${cursor.x}px ${cursor.y}px, rgba(74,222,128,0.12), transparent 80%)`,
          }}
        />
      )}

      {/* HEADER */}
      <header className="relative z-10 h-16 px-6 flex items-center justify-between">

        {/* BRAND */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">Ora</span>
          <span className="text-green-400">🎙️</span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/talk" className={linkClass}>Voice App</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-green-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* DIVIDER */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-[#0F1115] border-b border-white/10 px-6 py-6 space-y-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={linkClass}>Home</NavLink>
          <NavLink to="/talk" onClick={() => setMenuOpen(false)} className={linkClass}>Voice App</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)} className={linkClass}>About</NavLink>
        </div>
      )}

      {/* MAIN */}
      <main className="relative z-10 flex-1 px-6">
        {children}
      </main>
    </div>
  );
}
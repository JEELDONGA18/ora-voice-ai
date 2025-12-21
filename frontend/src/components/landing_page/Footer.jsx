import React from "react";
import { Github, Mail, Info } from "lucide-react";

export default function Footer() {
  const emailTo = "jeeldonga18@gmail.com";
  const emailCC = "dhyeydesai2626@gmail.com,yashdilkhush96@gmail.com";
  const subject = "Collaboration with Ora or Query about Ora";
  const body =
    "Hello there,%0D%0A%0D%0AI would like to connect regarding Ora.%0D%0A%0D%0ARegards,";

  const mailtoLink = `mailto:${emailTo}?cc=${emailCC}&subject=${encodeURIComponent(
    subject
  )}&body=${body}`;

  return (
    <footer className="relative bg-[#0B0B0F] border-t border-white/5 overflow-hidden">
      
      {/* Subtle top glow */}
      <div className="absolute inset-x-0 -top-10 h-20 bg-green-400/10 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="text-white text-xl font-semibold">
              Ora <span className="text-green-400">🎙️</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 max-w-xs">
              Built for natural, human conversation through voice-first AI.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm text-gray-400 items-center">

            <a
              href="/about"
              className="flex items-center gap-2 hover:text-white transition"
            >
              <Info size={16} />
              About
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/your-username/ora"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition"
            >
              <Github size={16} />
              GitHub
            </a>

            {/* Contact */}
            <a
              href={mailtoLink}
              className="flex items-center gap-2 hover:text-white transition"
            >
              <Mail size={16} />
              Contact
            </a>

          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/5" />

        {/* Bottom row */}
        <div className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ora. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
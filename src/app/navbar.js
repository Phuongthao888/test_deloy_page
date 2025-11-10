"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; 

export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, loading } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          current = section.id;
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md text-white z-50 shadow font-montserrat">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-3">
          <span className="font-extrabold text-lg">WINGS for LYHAN</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md text-white z-50 shadow font-montserrat">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-3">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Image
            src="/wings.jpg"
            alt="WingsForLyhan Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-extrabold text-lg tracking-wide">
            WINGS for LYHAN
          </span>
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-10 text-lg font-extrabold">
          {[
            { id: "introduction", label: "Introduction" },
            { id: "calendar", label: "Calendar" },
            { id: "music-releases", label: "Music Releases" },
            { id: "upcoming-events", label: "Events" },
            { id: "Boardcast", label: "Live Broadcasts" },
            { id: "Chart", label: "Charts" },
          ].map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${
                active === id ? "text-yellow-400" : ""
              } hover:text-yellow-400 transition`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* User / Mobile menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 font-semibold hover:text-yellow-400 transition"
              >
                <span>{user.name || user.email}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg text-sm py-1 z-[1000]">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2 gap-2 text-left hover:bg-zinc-800 transition"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Hamburger menu */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-md px-6 py-4 space-y-4 font-extrabold">
          {[
            { id: "introduction", label: "Introduction" },
            { id: "calendar", label: "Calendar" },
            { id: "music-releases", label: "Music Releases" },
            { id: "upcoming-events", label: "Events" },
            { id: "Boardcast", label: "Live Broadcasts" },
            { id: "Chart", label: "Charts" },
          ].map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`block ${
                active === id ? "text-yellow-400" : ""
              } hover:text-yellow-400 transition`}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}

          {user ? (
            <div className="pt-3 border-t border-zinc-700">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 transition"
              >
                <LogOut size={18} /> Log out
              </button>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
}

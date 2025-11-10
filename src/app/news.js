"use client";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CalendarLayout() {
  const [showGuide, setShowGuide] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const currentMonth = dayjs(new Date(2025, 9, 1));
  const events = {
    10: {
      title: "Concert",
      time: "12:00 - 23:00",
      location: "Sân vận động Quốc gia Mỹ Đình, Hà Nội",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3409.0967873828226!2d105.76391939999999!3d21.020483499999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345574d20b8f67%3A0xb34019170665308c!2zU8OibiB24bqtbiDEkeG7mW5nIFF14buRYyBnaWEgTeG7uSDEkMOsbmg!5e1!3m2!1svi!2s!4v1758895581991!5m2!1svi!2s"
    }
  };

  const startOfMonth = currentMonth.startOf("month");
  const daysInMonth = currentMonth.daysInMonth();
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;

  const daysArray = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  // ⏰ Auto-hide guide after 3s
  useEffect(() => {
    if (showGuide) {
      const timer = setTimeout(() => setShowGuide(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showGuide]);

  // 👀 Show guide overlay when scrolls into view
  useEffect(() => {
    const section = document.getElementById("calendar-section");
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasShown) {
            setShowGuide(true);
            setHasShown(true);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasShown]);

  return (
    <section
      id="calendar"
      className="relative min-h-screen flex justify-center items-center"
      onClick={() => setShowGuide(false)}
    >
      {/* 🌆 Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          priority
          className="object-cover filter grayscale"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 📅 Calendar */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div
          className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl 
                     p-4 sm:p-6 md:p-8 w-full max-w-[750px] border border-gray-200"
        >
          {/* 🧸 Chibi top-left */}
          <motion.img
            src="/chibi1.png"
            alt="decor top left"
            className="absolute -top-20 sm:-top-28 left-4 sm:left-8 w-24 sm:w-36 z-20"
            animate={{ y: [0, -10, 0, 10, 0], rotate: [0, -3, 0, 3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Header */}
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <h2 className="font-bold text-xl sm:text-2xl text-gray-800 tracking-wide">
              {currentMonth.format("MMMM YYYY")}
            </h2>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2 sm:mb-3 uppercase text-[10px] sm:text-sm">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
            {daysArray.map((day, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`relative group h-14 sm:h-16 md:h-20 rounded-lg md:rounded-xl 
                            flex flex-col items-center justify-start 
                            p-1 sm:p-2 transition cursor-pointer
                            ${
                              day
                                ? "bg-white/70 hover:bg-white border border-gray-200"
                                : ""
                            }`}
              >
                {day && (
                  <>
                    <span className="font-medium text-[11px] sm:text-sm text-gray-700">
                      {day}
                    </span>
                    {events[day] && (
                      <>
                        <img
                          src="/highlight.png"
                          alt="highlight"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        />
                        <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-red-500 font-semibold relative z-10">
                          {events[day].title}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 🧸 Chibi bottom-right */}
          <motion.img
            src="/chibi2.png"
            alt="decor right"
            className="absolute -bottom-6 -right-4 sm:-right-6 w-24 sm:w-32 opacity-95 drop-shadow-lg"
            animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.section>

      {/* 💫 Overlay hướng dẫn khi scroll tới */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            key="guide-overlay"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/90 px-6 py-4 rounded-xl text-center shadow-xl border border-gray-200"
            >
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                Nhấn vào ngày có sự kiện để xem chi tiết!
              </p>
              <motion.img
                src="Click-me.png"
                alt="hand pointer"
                className="mx-auto mt-3 w-10 sm:w-14 opacity-90"
                animate={{ y: [0, -10, 0], rotate: [0, -10, 0, 10, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

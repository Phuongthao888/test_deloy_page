"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const projects = [
  {
    id: 1,
    title: "Coming Soon",
    date: "Coming Soon",
    img: "/bg.jpg",
    status: "ongoing",
    desc: "Coming Soon",
    progress: 60,
  },
  {
    id: 2,
    title: "Coming Soon",
    date: "Coming Soon",
    img: "/bg.jpg",
    status: "upcoming",
    desc: "Coming Soon",
    progress: 20,
  },
  {
    id: 3,
    title: "Coming Soon",
    date: "Coming Soon",
    img: "/bg.jpg",
    status: "done",
    desc: "Coming Soon",
    progress: 100,
  },
];

export default function FanProjects() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: "ease-in-out",
      once: true, 
    });
  }, []);

  return (
    <section className="relative py-56 px-12 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] overflow-hidden text-gray-100 font-sans">   
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <h2
        data-aos="zoom-in"
        className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-24  
                   bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text relative z-10"
      >
        FAN PROJECTS
      </h2>

      <div
        data-aos="fade-up"
        className="flex justify-center flex-wrap gap-6 mb-20 relative z-10"
      >
        {["all", "ongoing", "upcoming", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-10 py-4 rounded-full border font-semibold text-lg backdrop-blur-md transition shadow-md
              ${
                filter === f
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg"
                  : "bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20"
              }`}
          >
            {f === "all"
              ? "Tất cả"
              : f === "ongoing"
              ? "Đang diễn ra"
              : f === "upcoming"
              ? "Sắp tới"
              : "Đã hoàn thành"}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-14 relative z-10">
        {filtered.map((p, i) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            data-aos="fade-up"
            data-aos-delay={i * 150}
            className="relative rounded-3xl overflow-hidden bg-[#111827]/80 shadow-lg border border-white/10 
                       group cursor-pointer hover:shadow-purple-500/40 hover:scale-[1.06] transition duration-300"
          >
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-80 object-cover opacity-80 group-hover:opacity-100 transition"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-3xl md:text-4xl font-bold">{p.title}</h3>
              <p className="text-base md:text-lg text-gray-300 mt-2">{p.date}</p>
            </div>
            <span
              className={`absolute top-6 right-6 px-6 py-3 rounded-full text-base md:text-lg font-bold shadow-xl
                    ${
                      p.status === "ongoing"
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : p.status === "upcoming"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                        : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                    }`}
            >
              {p.status === "ongoing"
                ? "Đang diễn ra"
                : p.status === "upcoming"
                ? "Sắp tới"
                : "Đã hoàn thành"}
            </span>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            data-aos="zoom-in"
            className="bg-[#0f172a]/95 border border-white/10 rounded-2xl shadow-2xl p-10 max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.img}
              alt={selected.title}
              className="w-full h-72 md:h-80 lg:h-96 object-cover rounded-xl mb-8"
            />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {selected.title}
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-3">
              {selected.date}
            </p>
            <p className="text-gray-300 mb-10">{selected.desc}</p>

            <div className="mb-10">
              <div className="w-full bg-gray-700 rounded-full h-5 md:h-6 overflow-hidden">
                <div
                  className={`h-5 md:h-6 rounded-full transition-all duration-500 
                    ${
                      selected.progress === 100
                        ? "bg-green-400"
                        : "bg-gradient-to-r from-blue-400 to-purple-500"
                    }`}
                  style={{ width: `${selected.progress}%` }}
                ></div>
              </div>
              <p className="text-sm md:text-base mt-2 text-gray-400">
                Tiến độ: {selected.progress}%
              </p>
            </div>

            <button
              className="px-7 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                         rounded-lg hover:opacity-90 transition shadow-lg shadow-purple-500/30"
              onClick={() => setSelected(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

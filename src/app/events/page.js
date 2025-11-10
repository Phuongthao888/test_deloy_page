"use client";

import { useEffect, useState } from "react";
import { eventService } from "@/services/event.services";
import {
  CalendarDays,
  MapPin,
  Loader2,
  X,
  Plus,
  // Edit,
  // Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null });
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        const sorted = data.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        const today = new Date();
        const updated = sorted.map((e) => {
          const start = new Date(e.startDate);
          const end = e.endDate ? new Date(e.endDate) : start;
          let status = "";

          if (today >= start && today <= end) status = "ongoing";
          else if (today < start) status = "upcoming";
          else status = "done";

          return { ...e, status };
        });

        setEvents(updated);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  const filtered =
    filter === "all"
      ? events
      : events.filter((e) => e.status?.toLowerCase() === filter);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-900">
        <Loader2 className="animate-spin w-8 h-8 text-white" />
      </div>
    );

  return (
    <section
      id="upcoming-events"
      className="relative py-32 px-6 md:px-20 bg-gradient-to-b from-[#0a0a0a]/95 via-[#111111]/80 to-transparent overflow-hidden text-gray-100 font-sans transition-all duration-700"
    >
      {/* Glowing background */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Header */}
      <div
        data-aos="zoom-in"
        className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6"
      >
        <h2 className="text-5xl md:text-6xl font-bold text-center md:text-left bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text tracking-tight">
          UPCOMING EVENTS
        </h2>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => router.push("/events/create")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        )}
      </div>

      {/* Filter buttons */}
      <div
        data-aos="fade-up"
        className="flex justify-center flex-wrap gap-6 mb-16 relative z-10"
      >
        {["all", "ongoing", "upcoming", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-3 rounded-full border font-semibold text-base backdrop-blur-md transition shadow-md ${
              filter === f
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg shadow-purple-500/40"
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

      {/* Event cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 col-span-full">
            Không có sự kiện nào.
          </p>
        ) : (
          filtered.map((event, i) => (
            <div
              key={event.id}
              onClick={() => setSelected(event)}
              data-aos="fade-up"
              data-aos-delay={i * 120}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0b0c10] to-[#161a22] border border-blue-400/10 shadow-[0_0_20px_rgba(96,165,250,0.08)] group cursor-pointer hover:shadow-[0_0_30px_rgba(96,165,250,0.25)] hover:border-blue-400/40 hover:scale-[1.03] transition duration-500"
            >
              {/* Image */}
              {event.mediaUrls?.[0] ? (
                <Image
                  src={event.mediaUrls[0]}
                  alt={event.title}
                  width={800}
                  height={500}
                  className="w-full h-72 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
              ) : (
                <div className="w-full h-72 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

              {/* Info */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold leading-snug group-hover:text-blue-400 transition">
                  {event.title}
                </h3>
                <p className="text-sm text-zinc-300 mt-2 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-400/70" />
                  {new Date(event.startDate).toLocaleDateString()}{" "}
                  {event.endDate
                    ? ` - ${new Date(event.endDate).toLocaleDateString()}`
                    : ""}
                </p>

                {/* 💤 Admin actions temporarily hidden */}
                {/* {user?.role === "ADMIN" && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/events/edit/${event.id}`);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-cyan-500 hover:bg-cyan-600 transition"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>

                    <button
                      onClick={(e) => handleDeleteClick(e, event)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-red-500 hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )} */}
              </div>

              {/* Status tag */}
              {event.status && (
                <span
                  className={`absolute top-5 right-5 px-5 py-2 rounded-full text-sm font-semibold shadow-md backdrop-blur-sm ${
                    event.status === "ongoing"
                      ? "bg-blue-500/30 text-blue-200 border border-blue-400/40"
                      : event.status === "upcoming"
                      ? "bg-sky-400/20 text-sky-200 border border-sky-300/40"
                      : "bg-zinc-500/20 text-zinc-300 border border-zinc-400/20"
                  }`}
                >
                  {event.status === "ongoing"
                    ? "Đang diễn ra"
                    : event.status === "upcoming"
                    ? "Sắp tới"
                    : "Đã hoàn thành"}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Detail */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setSelected(null)}
        >
          <div
            data-aos="zoom-in"
            className="bg-[#0f172a]/95 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            {selected.mediaUrls?.[0] && (
              <Image
                src={selected.mediaUrls[0]}
                alt={selected.title}
                width={800}
                height={500}
                className="w-full h-72 md:h-80 lg:h-96 object-cover rounded-xl mb-8"
              />
            )}

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {selected.title}
            </h3>

            <div className="flex items-center gap-3 text-zinc-400 mb-3">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Date(selected.startDate).toLocaleDateString()}{" "}
                {selected.endDate
                  ? ` - ${new Date(selected.endDate).toLocaleDateString()}`
                  : ""}
              </span>
            </div>

            {selected.location && (
              <div className="flex items-center gap-2 text-zinc-400 mb-5">
                <MapPin className="w-4 h-4" />
                <span>{selected.location}</span>
              </div>
            )}

            <p className="text-gray-300 mb-8 leading-relaxed">
              {selected.description}
            </p>

            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition shadow-lg shadow-purple-500/30"
              onClick={() => router.push(`/events/${selected.id}`)}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal (kept for future use) */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, item: null })}
        onConfirm={() => {}}
        type="danger"
        title="Delete Event"
        message={`Are you sure you want to delete "${confirmModal.item?.title}"?`}
        confirmText="Delete"
      />
    </section>
  );
}

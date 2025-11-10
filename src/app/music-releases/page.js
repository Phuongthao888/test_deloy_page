"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { musicService } from "@/services/music.services";
import Image from "next/image";
import {
  Loader2,
  Music4,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Grid3X3,
  Edit,
  Trash2,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../app/globals.css";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmModal from "@/components/common/ConfirmModal"; // ✅ thêm modal xác nhận

export default function MusicListPage() {
  const router = useRouter();
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();

  // ✅ Modal xác nhận (xóa)
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    item: null,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    containScroll: "trimSnaps",
    inViewThreshold: 0.6,
    speed: 6,
  });

  // AOS animation
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);

  // Fetch all music releases
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const data = await musicService.getAll();
        setMusicList(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load music releases");
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  // Handle carousel selection
  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", update);
    update();
  }, [emblaApi]);

  // Scroll handlers
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollNext()) emblaApi.scrollNext();
    else emblaApi.scrollTo(0);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollPrev()) emblaApi.scrollPrev();
    else emblaApi.scrollTo(musicList.length - 1);
  }, [emblaApi, musicList.length]);

  const handleDeleteClick = (e, item) => {
    e.stopPropagation();
    setConfirmModal({ open: true, item });
  };

  const handleConfirmDelete = async () => {
    const item = confirmModal.item;
    if (!item) return;
    try {
      await musicService.remove(item.id);
      setMusicList((prev) => prev.filter((m) => m.id !== item.id));
      toast.success("Music release deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete release");
    } finally {
      setConfirmModal({ open: false, item: null });
    }
  };

  return (
    <section
      id="music-releases"
      className="relative w-full min-h-screen text-white flex flex-col items-center py-20 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90" />
      </div>

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between w-full max-w-6xl mb-10 gap-4"
        data-aos="fade-down"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold flex items-center gap-3 tracking-tight">
          <Music4 className="w-10 h-10 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Music Releases
          </span>
        </h1>

        <div
          className="flex items-center gap-4"
          data-aos="fade-left"
          data-aos-delay="100"
        >
          {user?.role === "ADMIN" && (
            <button
              onClick={() => router.push("/music-releases/create")}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition shadow-md hover:shadow-cyan-400/40"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          )}
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm font-medium transition border border-white/10 hover:border-cyan-400/40"
          >
            <Grid3X3 className="w-5 h-5 text-cyan-400" />
            Show All
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24" data-aos="fade-in">
          <Loader2 className="animate-spin w-8 h-8 text-cyan-400" />
        </div>
      )}

      {/* Empty */}
      {!loading && musicList.length === 0 && (
        <div className="text-zinc-300 text-lg mt-10" data-aos="fade-up">
          No releases yet.
        </div>
      )}

      {/* Carousel */}
      {!loading && musicList.length > 0 && (
        <div className="relative w-full max-w-7xl" data-aos="zoom-in-up">
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-cyan-400/30 text-white p-3 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-cyan-400/30 text-white p-3 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <motion.div
            ref={emblaRef}
            className="overflow-hidden w-full cursor-grab active:cursor-grabbing relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center">
              {musicList.map((item, i) => {
                const isActive = i === selectedIndex;
                const scale = isActive ? 1 : 0.85;
                const opacity = isActive ? 1 : 0.6;
                const blur = isActive ? "blur(0px)" : "blur(1.5px)";
                const brightness = isActive ? "brightness(1.15)" : "brightness(0.75)";

                return (
                  <motion.div
                    key={item.id}
                    data-aos="fade-up"
                    data-aos-delay={i * 150}
                    style={{
                      scale,
                      opacity,
                      filter: `${blur} ${brightness}`,
                      transformOrigin: "center",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`embla__slide relative flex-[0_0_80%] sm:flex-[0_0_60%] lg:flex-[0_0_40%] mx-4 rounded-3xl overflow-hidden border bg-white/5 shadow-lg transition-all duration-500 group ${
                      isActive
                        ? "border-cyan-400/60 shadow-cyan-400/20"
                        : "border-white/10 shadow-black/10"
                    }`}
                    onClick={() => router.push(`/music-releases/${item.id}`)}
                  >
                    {item.thumbnail ? (
                      <div className="relative w-full h-80">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className={`object-cover transition-transform duration-700 ${
                            isActive ? "group-hover:scale-105" : "opacity-80"
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-80 flex items-center justify-center bg-zinc-800 text-zinc-500">
                        <Music4 className="w-10 h-10" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 transition-all duration-500 rounded-3xl ${
                        isActive
                          ? "bg-gradient-to-t from-black/70 via-black/40 to-transparent"
                          : "bg-gradient-to-t from-black/80 via-black/60 to-transparent"
                      }`}
                    />

                    {/* Info */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <h2
                        className={`text-xl font-semibold mb-1 truncate transition-colors ${
                          isActive ? "text-white group-hover:text-cyan-400" : "text-zinc-300"
                        }`}
                      >
                        {item.title}
                      </h2>

                      <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/10 pt-2">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.createdBy?.name && (
                          <span className="italic">by {item.createdBy.name}</span>
                        )}
                      </div>

                      {item.description && (
                        <p
                          className={`text-sm mt-2 line-clamp-2 transition-colors ${
                            isActive ? "text-zinc-200" : "text-zinc-500"
                          }`}
                        >
                          {item.description.length > 100
                            ? item.description.slice(0, 100) + "..."
                            : item.description}
                        </p>
                      )}

                      {/* Admin Actions */}
                      {user?.role === "ADMIN" && (
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/music-releases/edit/${item.id}`);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-cyan-500 hover:bg-cyan-600 transition"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>

                          <button
                            onClick={(e) => handleDeleteClick(e, item)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-red-500 hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ✅ Confirm Delete Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, item: null })}
        onConfirm={handleConfirmDelete}
        type="danger"
        title="Delete Music Release"
        message={`Are you sure you want to delete "${confirmModal.item?.title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </section>
  );
}

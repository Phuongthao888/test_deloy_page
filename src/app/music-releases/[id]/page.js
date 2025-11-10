"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { musicService } from "@/services/music.services";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Music4,
  ShoppingBag,
  User,
  CalendarDays,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";

// Custom Spotify icon (vì lucide-react không có Spotify)
const SpotifyIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path
      d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5zm4.17 14.58a.75.75 0 0 1-1.04.25c-2.85-1.74-6.45-2.14-10.68-1.2a.75.75 0 0 1-.32-1.46c4.6-1.03 8.64-.59 11.82 1.35.36.22.47.69.23 1.06zm.74-3.13a.94.94 0 0 1-1.3.32c-3.26-2-8.24-2.57-12.1-1.44a.94.94 0 0 1-.53-1.8c4.39-1.3 9.87-.66 13.6 1.6.45.28.6.87.32 1.32zm.13-3.18C13.3 7.33 8.41 7.18 5.15 8.15a1.13 1.13 0 1 1-.65-2.16c3.8-1.15 9.34-.97 13.4 1.05a1.13 1.13 0 0 1-1.06 2z"
      fill="currentColor"
    />
  </svg>
);

export default function MusicDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const data = await musicService.getById(id);
        console.log("🎵 [MusicDetail] Raw data from API:", data);
        setMusic(data);
      } catch (err) {
        console.error("❌ Error fetching music:", err);
        toast.error("Failed to load music release");
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c0d] text-white">
        <Loader2 className="animate-spin w-8 h-8 text-sky-400" />
      </div>
    );

  if (!music)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0c0d] text-zinc-400 space-y-3">
        <Music4 className="w-10 h-10 text-zinc-500" />
        <p className="text-sm">Release not found.</p>
        <button
          onClick={() => router.push("/music")}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 text-white text-sm transition"
        >
          Back to Releases
        </button>
      </div>
    );

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={music.thumbnail}
          alt={music.title}
          fill
          priority
          className="object-cover brightness-[0.9] blur-[8px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="relative w-full md:w-[40%] aspect-square rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(180,200,255,0.25)] border border-white/10">
            <Image
              src={music.thumbnail}
              alt={music.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-6 md:pt-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                {music.title}
              </h1>
              {music.releaseType && (
                <p className="text-xl font-semibold text-sky-400 uppercase tracking-wide mt-2">
                  {music.releaseType}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-b border-white/10 py-4 text-sm">
              <div className="flex items-center gap-2 text-lg text-zinc-200">
                <User className="w-4 h-4 text-sky-400" />
                <span>
                  <strong className="text-white">Artist:</strong>{" "}
                  {music.credits || "Unknown Artist"}
                </span>
              </div>

              <div className="flex flex-col items-start sm:items-end text-zinc-300">
                {music.createdBy?.name && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>
                      <strong className="text-white">Created by:</strong>{" "}
                      {music.createdBy.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                  <CalendarDays className="w-3 h-3" />
                  <span>
                    {new Date(music.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {music.description && (
              <p className="text-zinc-200 leading-relaxed max-w-xl">
                {music.description}
              </p>
            )}

            <button className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full hover:opacity-90 transition">
              <ShoppingBag className="w-4 h-4" />
              Buy Album
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent my-14" />

        {/* 🎧 Tracklist */}
        {music.tracks?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Tracklist</h2>
            <div className="space-y-3">
              {[...music.tracks]
                .sort(
                  (a, b) =>
                    (b.isTitleTrack ? 1 : 0) - (a.isTitleTrack ? 1 : 0) ||
                    (a.order || 0) - (b.order || 0)
                )
                .map((track, index) => (
                  <div
                    key={track.id || index}
                    className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                      track.isTitleTrack
                        ? "bg-white/10 border border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                        : "bg-white/5 hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 text-right ${
                          track.isTitleTrack
                            ? "text-white font-bold"
                            : "text-zinc-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <p
                          className={`font-medium ${
                            track.isTitleTrack
                              ? "text-white text-lg"
                              : "text-zinc-200"
                          }`}
                        >
                          {track.title}
                        </p>

                        {/* YouTube & Spotify links */}
                        <div className="flex gap-3 mt-1">
                          {track.youtubeUrl && (
                            <a
                              href={track.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-sky-400 hover:underline"
                            >
                              <Youtube className="w-3 h-3" /> YouTube
                            </a>
                          )}
                          {track.spotifyUrl && (
                            <a
                              href={track.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-green-400 hover:underline"
                            >
                              <SpotifyIcon className="w-3 h-3" /> Spotify
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    {track.isTitleTrack && (
                      <span className="text-xs text-white font-semibold uppercase tracking-wide">
                        Title
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 🎬 Behind The Scene */}
        {music.behindTheScene?.length > 0 && (
          <motion.div
            className="space-y-8 text-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-semibold bg-gradient-to-r from-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Behind the Scene
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {music.behindTheScene.map((link, i) => {
                const isYouTube =
                  link.includes("youtube.com") || link.includes("youtu.be");
                const videoId = isYouTube
                  ? link.includes("v=")
                    ? link.split("v=")[1].split("&")[0]
                    : link.split("/").pop()
                  : null;

                return (
                  <motion.div
                    key={i}
                    className="aspect-video w-full max-w-[420px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(150,180,255,0.2)] hover:shadow-[0_0_50px_rgba(180,220,255,0.3)] hover:scale-[1.03] transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                  >
                    {videoId ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={`Behind the Scene ${i + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:underline text-sm break-all p-4"
                      >
                        {link}
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 🎵 Spotify Embed - hiển thị tất cả track có Spotify URL */}
        {music.tracks?.some((t) => t.spotifyUrl) && (
          <div className="mt-10 space-y-10">
            <h3 className="text-2xl font-semibold text-white mb-3 flex items-center gap-2">
              Nghe trên Spotify
            </h3>
            {music.tracks
              .filter((t) => t.spotifyUrl)
              .map((t, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden shadow-lg border border-white/10"
                >
                  <iframe
                    src={t.spotifyUrl.replace(
                      "open.spotify.com/track/",
                      "open.spotify.com/embed/track/"
                    )}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                    title={`Spotify ${t.title}`}
                  ></iframe>
                </div>
              ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}

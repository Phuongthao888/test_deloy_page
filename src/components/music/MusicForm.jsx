"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { musicService } from "@/services/music.services";
import {
  Plus,
  Trash2,
  Upload,
  Sparkles,
  ArrowLeft,
  Music4,
} from "lucide-react";

export default function MusicForm({ mode = "create", initialData = null }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    title: "",
    releaseType: "ALBUM",
    description: "",
    credits: "",
    thumbnail: null,
    behindTheScene: [""],
    tracks: [
      { title: "", youtubeUrl: "", spotifyUrl: "", isTitleTrack: false, order: 1 },
    ],
  });

  const [loading, setLoading] = useState(false);

  // ✅ Nạp dữ liệu nếu là edit
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        releaseType: initialData.releaseType || "ALBUM",
        description: initialData.description || "",
        credits: initialData.credits || "",
        thumbnail: null,
        behindTheScene: initialData.behindTheScene || [""],
        tracks:
          initialData.tracks?.length > 0
            ? initialData.tracks
            : [{ title: "", youtubeUrl: "", spotifyUrl: "", isTitleTrack: false, order: 1 }],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) handleChange("thumbnail", file);
  };

  const handleTrackChange = (index, field, value) => {
    const updated = [...form.tracks];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, tracks: updated }));
  };

  const addTrack = () =>
    setForm((prev) => ({
      ...prev,
      tracks: [
        ...prev.tracks,
        {
          title: "",
          youtubeUrl: "",
          spotifyUrl: "",
          isTitleTrack: false,
          order: prev.tracks.length + 1,
        },
      ],
    }));

  const removeTrack = (index) => {
    const updated = form.tracks.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, tracks: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("releaseType", form.releaseType);
      formData.append("description", form.description);
      formData.append("credits", form.credits);
      if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
      formData.append("behindTheScene", JSON.stringify(form.behindTheScene.filter(Boolean)));
      formData.append("tracks", JSON.stringify(form.tracks.filter((t) => t.title.trim() !== "")));

      if (isEdit && initialData?.id) {
        await musicService.update(initialData.id, formData);
        toast.success("Music release updated successfully!");
        router.push(`/music-releases/${initialData.id}`);
      } else {
        const created = await musicService.create(formData);
        toast.success("Music release created successfully!");
        router.push(`/music-releases/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? "Failed to update release" : "Failed to create release");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0c0d] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-300 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-4xl font-extrabold mb-10 flex items-center gap-3">
          <Music4 className="w-8 h-8 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            {isEdit ? "Edit Music Release" : "Create Music Release"}
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-cyan-400 outline-none"
            />
          </div>

          {/* Release Type */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Release Type</label>
            <select
              value={form.releaseType}
              onChange={(e) => handleChange("releaseType", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white cursor-pointer focus:border-cyan-400 outline-none"
            >
              <option value="SINGLE">Single</option>
              <option value="ALBUM">Album</option>
              <option value="FEAT">Feat</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-cyan-400 outline-none"
            />
          </div>

          {/* Credits */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Credits</label>
            <input
              type="text"
              value={form.credits}
              onChange={(e) => handleChange("credits", e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-cyan-400 outline-none"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Thumbnail</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center w-40 h-40 border border-white/20 rounded-xl bg-white/5 cursor-pointer hover:border-cyan-400/50 transition">
                {form.thumbnail || initialData?.thumbnail ? (
                  <Image
                    src={
                      form.thumbnail
                        ? URL.createObjectURL(form.thumbnail)
                        : initialData.thumbnail
                    }
                    alt="Thumbnail"
                    width={160}
                    height={160}
                    className="object-cover rounded-xl w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center text-zinc-400 text-sm">
                    <Upload className="w-6 h-6 mb-1" />
                    Upload
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Behind the Scene */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">
              Behind The Scene (YouTube links)
            </label>
            {form.behindTheScene.map((link, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => {
                    const updated = [...form.behindTheScene];
                    updated[i] = e.target.value;
                    setForm((prev) => ({ ...prev, behindTheScene: updated }));
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-cyan-400 outline-none"
                />
                {i === form.behindTheScene.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        behindTheScene: [...prev.behindTheScene, ""],
                      }))
                    }
                    className="p-2 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 transition"
                  >
                    <Plus className="w-4 h-4 text-cyan-300" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = form.behindTheScene.filter((_, j) => j !== i);
                      setForm((prev) => ({ ...prev, behindTheScene: updated }));
                    }}
                    className="p-2 rounded-lg bg-red-500/50 hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Tracks
            </h3>
            {form.tracks.map((track, i) => (
              <div
                key={i}
                className="border border-white/10 bg-white/5 rounded-xl p-4 mb-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Track {i + 1}</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-zinc-400 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={track.isTitleTrack}
                        onChange={(e) =>
                          handleTrackChange(i, "isTitleTrack", e.target.checked)
                        }
                      />
                      Title Track
                    </label>
                    {form.tracks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTrack(i)}
                        className="p-2 rounded-lg hover:bg-red-500/50 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={track.title}
                  onChange={(e) => handleTrackChange(i, "title", e.target.value)}
                  placeholder="Track title"
                  className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white outline-none focus:border-cyan-400"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={track.youtubeUrl}
                    onChange={(e) =>
                      handleTrackChange(i, "youtubeUrl", e.target.value)
                    }
                    placeholder="YouTube URL"
                    className="flex-1 rounded-lg bg-white/10 border border-white/20 p-3 text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    value={track.spotifyUrl}
                    onChange={(e) =>
                      handleTrackChange(i, "spotifyUrl", e.target.value)
                    }
                    placeholder="Spotify URL"
                    className="flex-1 rounded-lg bg-white/10 border border-white/20 p-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTrack}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-cyan-500/40 hover:bg-cyan-500/60 rounded-lg text-white text-sm transition"
            >
              <Plus className="w-4 h-4" /> Add Track
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 rounded-xl font-semibold text-white text-lg transition"
          >
            {loading ? (isEdit ? "Updating..." : "Publishing...") : isEdit ? "Update Release" : "Publish Release"}
          </button>
        </form>
      </div>
    </main>
  );
}

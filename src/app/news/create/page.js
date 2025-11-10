"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { newsService } from "@/services/news.services";
import toast from "react-hot-toast";
import { Loader2, Upload, Plus } from "lucide-react";

export default function CreateNewsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (form.date) formData.append("date", form.date);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      await newsService.create(formData);
      toast.success("News post created successfully 🎉");
      router.push("/news");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Failed to create news post. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/10 border border-white/10 rounded-2xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold mb-2">Create News Post</h1>
        <p className="text-sm text-zinc-400 mb-4">
          Write a new update, announcement, or article.
        </p>

        {/* Title */}
        <div>
          <label className="block text-sm mb-1">Title *</label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm mb-1">Content *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={6}
            required
            className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm mb-1">Thumbnail</label>
          <label className="cursor-pointer bg-white/10 border border-white/20 hover:bg-white/20 transition rounded-lg px-4 py-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {thumbnail && (
            <p className="text-sm text-zinc-400 mt-1">{thumbnail.name}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg py-2 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" /> Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Create Post
            </>
          )}
        </button>
      </form>
    </div>
  );
}

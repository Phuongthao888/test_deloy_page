"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { newsService } from "@/services/news.services";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getById(id);
        setNews(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-400" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 space-y-2">
        <Newspaper className="w-10 h-10 text-zinc-500" />
        <p>Article not found.</p>
        <button
          onClick={() => router.push("/news")}
          className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm transition"
        >
          Back to News
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Thumbnail */}
        {news.thumbnail ? (
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-white/10">
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-[300px] w-full flex items-center justify-center bg-zinc-800 text-zinc-500 rounded-xl border border-white/10">
            <Newspaper className="w-10 h-10" />
          </div>
        )}

        {/* Title & meta */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{news.title}</h1>
          <div className="text-sm text-zinc-400 flex gap-3">
            <span>
              {new Date(news.date || news.createdAt).toLocaleDateString()}
            </span>
            {news.createdBy?.name && (
              <span>by {news.createdBy.name}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert max-w-none leading-relaxed text-zinc-200">
          {news.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </motion.div>
    </main>
  );
}

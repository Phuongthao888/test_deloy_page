"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { newsService } from "@/services/news.services";
import { Loader2, Newspaper } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function NewsListPage() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getAll();
        setNews(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-900 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Newspaper className="w-7 h-7 text-cyan-400" />
          Latest News
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin w-6 h-6 text-cyan-400" />
          </div>
        )}

        {/* Empty state */}
        {!loading && news.length === 0 && (
          <div className="text-center text-zinc-400 py-20">
            No news posts yet.  
            <p className="mt-2 text-sm">Try creating one from the admin panel.</p>
          </div>
        )}

        {/* News list */}
        {!loading && news.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/news/${item.id}`)}
                className="cursor-pointer group bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-2xl overflow-hidden shadow-md transition transform hover:-translate-y-1 hover:shadow-cyan-500/20"
              >
                {/* Thumbnail */}
                {item.thumbnail ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                    <Newspaper className="w-8 h-8" />
                  </div>
                )}

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold group-hover:text-cyan-400 transition">
                    {item.title}
                  </h2>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {item.content.length > 80
                      ? item.content.slice(0, 80) + "..."
                      : item.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">
                    <span>
                      {new Date(item.date || item.createdAt).toLocaleDateString()}
                    </span>
                    {item.createdBy?.name && <span>by {item.createdBy.name}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

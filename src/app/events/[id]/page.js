"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventService } from "@/services/event.services";
import { CalendarDays, MapPin, User, Tag, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const data = await eventService.getById(id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-white" />
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <p className="text-lg mb-3">Event not found</p>
        <button
          onClick={() => router.push("/events")}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Thumbnail */}
        {event.mediaUrls?.length > 0 && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={event.mediaUrls[0]}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 80vw,
                     1200px"
              className="object-cover"
            />
          </div>
        )}

        {/* Title + meta */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-zinc-300">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Date(event.startDate).toLocaleDateString()}{" "}
                {event.endDate
                  ? ` - ${new Date(event.endDate).toLocaleDateString()}`
                  : ""}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}

            {event.createdBy && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {event.createdBy.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-zinc-200 leading-relaxed">
          {event.description || "No description provided."}
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {event.tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-sm text-zinc-200"
              >
                <Tag className="w-3 h-3" />
                {tag.name}
              </div>
            ))}
          </div>
        )}

        {/* Gallery */}
        {event.mediaUrls?.length > 1 && (
          <div className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.mediaUrls.slice(1).map((url, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`media-${index}`}
                    fill
                    sizes="(max-width: 768px) 50vw,
                           (max-width: 1200px) 33vw,
                           300px"
                    className="object-cover hover:opacity-90 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

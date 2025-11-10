"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventService } from "@/services/event.services";
import EventsForm from "@/components/event/EventsForm";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await eventService.getById(id);
        console.log("📦 Event data received:", data);
        setEventData(data);
      } catch {
        toast.error("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await eventService.update(id, formData);
      toast.success("Event updated successfully ");
      router.push("/events");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-900">
        <Loader2 className="animate-spin w-8 h-8 text-white" />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#0f172a] to-[#1e293b] text-white px-4 py-20">
      <EventsForm initialData={eventData} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}

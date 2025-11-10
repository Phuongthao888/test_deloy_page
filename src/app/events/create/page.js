"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { eventService } from "@/services/event.services";
import EventsForm from "@/components/event/EventsForm";
import toast from "react-hot-toast";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await eventService.create(formData);
      toast.success("Event created successfully 🎉");
      router.push("/wfl-hehe");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#0f172a] to-[#1e293b] text-white px-4 py-20">
      <EventsForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

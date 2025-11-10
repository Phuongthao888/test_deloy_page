"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { musicService } from "@/services/music.services";
import MusicForm from "@/components/music/MusicForm";
import { Loader2 } from "lucide-react";

export default function MusicEditPage() {
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await musicService.getById(id);
        setMusic(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <Loader2 className="animate-spin w-8 h-8 text-cyan-400" />
      </div>
    );

  return <MusicForm mode="edit" initialData={music} />;
}

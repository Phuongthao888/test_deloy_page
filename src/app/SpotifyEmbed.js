"use client";

export default function SpotifyEmbed({ src, height = 420 }) {
  return (
    <div className="w-full max-w-md mx-auto my-6">
      <iframe
        style={{ borderRadius: "12px" }}
        src={src}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

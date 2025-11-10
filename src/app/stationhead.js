"use client";

import { useEffect, useState, useRef } from "react";

export default function StationHead() {
  const [isLive, setIsLive] = useState(true);
  const canvasRef = useRef(null);
  const avatarRef = useRef(null);
  const containerRef = useRef(null); // container bao cả canvas + avatar

  useEffect(() => {
    const canvas = canvasRef.current;
    const avatar = avatarRef.current;
    const container = containerRef.current;
    if (!canvas || !avatar || !container) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext("2d");
    const ripples = [];

    function getAvatarCenter() {
      const avatarRect = avatar.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return {
        x: avatarRect.left - containerRect.left + avatar.offsetWidth / 2,
        y: avatarRect.top - containerRect.top + avatar.offsetHeight / 2,
        radius: avatar.offsetWidth / 2,
      };
    }

    function spawnRipple() {
      const { x, y, radius } = getAvatarCenter();
      ripples.push({
        x,
        y,
        r: radius,
        innerR: radius,
        alpha: 0.8,
        speed: 0.8,
        maxR: Math.max(canvas.width, canvas.height),
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ring = ripples[i];
        ring.r += ring.speed ;
        ring.alpha *= 0.96;

        if (ring.r > ring.maxR || ring.alpha < 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(
          ring.x,
          ring.y,
          ring.innerR,
          ring.x,
          ring.y,
          ring.r
        );
        gradient.addColorStop(0, `rgba(0,212,255,${ring.alpha})`);
        gradient.addColorStop(0.3, `rgba(0,212,255,${ring.alpha * 0.6})`);
        gradient.addColorStop(0.6, `rgba(0,212,255,${ring.alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(0,212,255,0)`);

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    const interval = setInterval(spawnRipple, 1200);
    animate();

    return () => clearInterval(interval);
  }, []);

  return (
    <section
    id="Boardcast"
     className="min-h-screen text-white px-6 py-20 bg-gradient-to-br from-slate-900 via-black to-cyan-900/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-200 bg-clip-text text-transparent mb-4">
            LIVE BROADCAST
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join the exclusive listening experience with{" "}
            <span className="text-cyan-400">WINGS for LYHAN</span> on Stationhead
          </p>
        </div>

        {/* Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
            
            {/* Header Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 p-6 bg-black/40 rounded-2xl border border-slate-700/40">
              <div className="flex items-center gap-6">
                <img
                  src="https://www.stationhead.com/assets/stationhead-logo-2a161b5e.svg"
                  alt="Stationhead"
                  className="h-14 filter brightness-0 invert opacity-80"
                />
                <div className="h-12 w-px bg-gradient-to-b from-slate-600 to-transparent"></div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${isLive ? "bg-cyan-400 animate-pulse" : "bg-gray-500"}`}
                    ></div>
                    <span className="text-lg font-semibold text-slate-300 uppercase tracking-wider">
                      {isLive ? "ON AIR" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              <a
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                href="https://app.stationhead.com/wingsforlyhan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative z-10">Join Live Session</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>

            {/* Ripple + Avatar */}
            <div
              ref={containerRef}
              className="relative flex items-center justify-center rounded-2xl overflow-hidden"
              style={{
                height: "400px",
                background: "radial-gradient(circle at center, #0a0f1f 0%, #020617 100%)",
              }}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                  mixBlendMode: "screen",
                  filter: "blur(3px)",
                  opacity: 0.6,
                  pointerEvents: "none",
                }}
              />

              {/* Avatar Ring */}
              <div className="relative flex flex-col items-center justify-center text-center z-10">
                <div className="relative mb-8">
                  <div
                    ref={avatarRef} // gắn ref vào vòng ring avatar
                    className="relative w-36 h-36 mx-auto rounded-full overflow-hidden ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/20"
                  >
                    <img
                      src="wings-trans.png"
                      alt="Avatar"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-cyan-500/20 blur-2xl"></div>
                  </div>
                </div>

                <p className="text-xl text-slate-300 font-light tracking-wide">
                  Broadcasting live on{" "}
                  <span className="text-cyan-400">Stationhead</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

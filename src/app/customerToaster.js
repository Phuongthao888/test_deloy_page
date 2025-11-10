"use client";
import { Toaster } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "modern-toast",
          style: {
            background: "rgba(36, 36, 36, 0.8)",
            color: "#f9fafb",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            padding: "12px 18px",
            fontSize: "16px",
            fontWeight: 500,
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            width: "340px",
            position: "relative",
            overflow: "hidden",
            height: "80px",
          },
          success: {
            iconTheme: {
              primary: "#22d3ee",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#0f172a",
            },
          },
        }}
      />

      <style jsx global>{`
        @keyframes toast-slide-in {
          0% {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          60% {
            opacity: 1;
            transform: translateX(-4px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .modern-toast {
          animation: toast-slide-in 0.35s ease-out;
        }

        .modern-toast::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background-color: #22d3ee;
          transform-origin: left;
          animation: toast-progress 4s linear forwards;
          opacity: 0.9;
        }

        .modern-toast[data-type="error"]::after {
          background-color: #ef4444;
        }

        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        .modern-toast[data-leave] {
          animation: toast-fade-out 0.25s ease-in forwards !important;
        }

        @keyframes toast-fade-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
      `}</style>
    </>
  );
}

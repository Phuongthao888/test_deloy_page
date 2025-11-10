"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  type = "warning",
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
}) {
  if (!open) return null;

  const colorMap = {
    warning: {
      icon: <AlertTriangle className="w-10 h-10 text-yellow-400" />,
      confirm: "bg-yellow-500 hover:bg-yellow-600",
    },
    danger: {
      icon: <AlertTriangle className="w-10 h-10 text-red-500" />,
      confirm: "bg-red-500 hover:bg-red-600",
    },
    success: {
      icon: <CheckCircle2 className="w-10 h-10 text-cyan-400" />,
      confirm: "bg-cyan-500 hover:bg-cyan-600",
    },
  };

  const { icon, confirm } = colorMap[type] || colorMap.warning;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-zinc-900/90 border border-white/10 rounded-2xl max-w-md w-full p-6 text-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">{icon}</div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-2">{title}</h2>

            {/* Message */}
            <p className="text-zinc-400 mb-6">{message}</p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition text-white text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2 rounded-full text-white text-sm font-medium transition ${confirm}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Intro({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 2500); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
            animate={{ clipPath: "circle(120% at 50% 50%)", opacity: 1 }}
            transition={{ duration: 2, ease: [0.42, 0, 0.58, 1] }}
            className="w-full h-full relative"
          >
            <div className="hidden sm:block w-full h-full">
              <Image
                src="/wings.jpg"
                alt="Intro desktop"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="block sm:hidden w-full h-full">
              <Image
                src="/wings.jpg"
                alt="Intro mobile"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

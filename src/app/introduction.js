"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TVIntro() {
  const objects = [
    {
      bg: "/lyhan.jpg",
      tvImages: ["/lyhan-1.jpg", "/lyhan-2.jpg", "/lyhan-3.jpg"],
      contents: [
        {
          title: "",
          desc: "Năm 2017, LYHAN quyết định Nam tiến, theo học chuyên ngành Thanh nhạc tại SMPAA – một trong những trường đào tạo nghệ sĩ chuyên nghiệp hàng đầu tại TP. HCM. Trải qua khoảng thời gian tìm kiếm và định hướng màu sắc âm nhạc cá nhân, LYHAN đã thử sức ở nhiều thể loại khác nhau.",
        },
        {
          title: "",
          desc: 'Cuối năm 2024, LYHAN chính thức ra mắt công chúng với vai trò ca sĩ, thổi làn gió mới vào thị trường âm nhạc Việt bằng ca khúc "Nhân Danh Tình Yêu". LYHAN gây ấn tượng với khán giả qua giọng hát mang chất riêng, khả năng sáng tác đa dạng, kết hợp với kĩ năng trình diễn đầy cuốn hút.',
        },
        {
          title: "",
          desc: 'Góp mặt trong chương trình Em Xinh "Say Hi" mùa đầu tiên và khép lại hành trình ấy với ngôi vị Á Quân, LYHAN đang dần khẳng định được vị thế của mình là một trong những nghệ sĩ trẻ đa tài của nền âm nhạc Việt.',
        },
      ],
    },
  ];

  const [currentObj, setCurrentObj] = useState(0);
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const handleNext = () => {
    if (currentIndex < objects[currentObj].contents.length - 1) {
      setCurrentIndex([currentIndex + 1, 1]);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex([currentIndex - 1, -1]);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  return (
    <section
      id="introduction"
      className="relative w-screen h-screen flex flex-col 
                 bg-black text-white overflow-hidden"
      style={{
        backgroundImage: `url(${objects[currentObj].bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      

      <div
        ref={ref}
        className="relative w-full h-full grid grid-cols-1 md:grid-cols-2 gap-10 p-10 mt-16"
      >
        <motion.section
          initial={{ opacity: 0, x: -80 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center z-20 items-center"
        >
          <motion.div
            className="w-full md:w-[85%] lg:w-[90%] space-y-6 max-w-2xl mx-auto"
          >
            <div className="relative w-full h-[380px] sm:h-[440px] md:h-[520px] overflow-hidden">
              <AnimatePresence mode="sync" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 28,
                    mass: 0.8,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -100) handleNext();
                    else if (info.offset.x > 100) handlePrev();
                  }}
                  className="absolute top-0 left-0 w-full h-full
                             bg-black/70 p-8 sm:p-10 rounded-2xl shadow-2xl
                             flex flex-col justify-start overflow-y-auto
                             scrollbar-thin scrollbar-thumb-gray-500/50 scrollbar-track-transparent
                             will-change-transform"
                >
                  <motion.p
                    key={objects[currentObj].contents[currentIndex].desc}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-lg sm:text-xl md:text-2xl leading-relaxed break-words whitespace-pre-line font-semibold"
                  >
                    {objects[currentObj].contents[currentIndex].desc}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-12 h-12 flex items-center justify-center rounded-full 
                           bg-white/20 text-white shadow-md
                           backdrop-blur-md transition-all duration-300
                           hover:bg-yellow-400/70 hover:text-black 
                           disabled:opacity-40 disabled:hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === objects[currentObj].contents.length - 1}
                className="w-12 h-12 flex items-center justify-center rounded-full 
                           bg-white/20 text-white shadow-md
                           backdrop-blur-md transition-all duration-300
                           hover:bg-yellow-400/70 hover:text-black 
                           disabled:opacity-40 disabled:hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 80 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex items-center justify-center px-4 sm:px-6 md:px-0"
        >
          <div
            className="relative w-full max-w-[800px] h-[320px] sm:h-[400px] md:h-[520px] 
                        flex items-center justify-center bg-black/30 rounded-2xl 
                        shadow-2xl backdrop-blur-md overflow-hidden"
          >
            {objects[currentObj].tvImages.map((src, idx) => {
              const diff = idx - currentIndex;
              return (
                <motion.img
                  key={idx + "-" + src}
                  src={src}
                  alt={`img-${idx}`}
                  className="absolute w-[180px] sm:w-[260px] md:w-[380px] 
                             h-[240px] sm:h-[320px] md:h-[440px] 
                             object-cover rounded-xl shadow-lg"
                  animate={{
                    x: diff * 220,
                    scale: diff === 0 ? 1.05 : 0.9,
                    opacity: diff === 0 ? 1 : 0.25,
                    zIndex: 10 - Math.abs(diff),
                    filter: diff === 0 ? "blur(0px)" : "blur(4px)",
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              );
            })}
          </div>
        </motion.section>
      </div>
    </section>
  );
}
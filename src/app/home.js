"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import SpotifyEmbed from "./SpotifyEmbed";
import Footer from "./footer";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <main className="relative min-h-screen text-white">
      <section
        id="stationhead"
        className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 md:px-12 py-20"
      >
        <h2
          className="text-6xl font-bold mb-16 text-center"
          data-aos="fade-up"
        >
          Hướng dẫn Stream trên Stationhead
        </h2>

        <div className="max-w-6xl space-y-24">
          <section className="w-full" data-aos="fade-up">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                1.Tham gia Stationhead
              </h2>
              <p className="text-lg text-gray-700 mb-3">
                Tải Stationhead trên{" "}
                <a
                  href="https://apps.apple.com/us/app/stationhead/id1076117681"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  iOS
                </a>{" "}
                hoặc{" "}
                <a
                  href="https://play.google.com/store/apps/details?id=com.stationhead.app&pcampaignid=web_share"
                  className="text-green-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Android
                </a>
                .
              </p>
              <p className="text-lg text-gray-700 mb-10">
                Hoặc truy cập{" "}
                <a
                  href="https://www.stationhead.com/wingsforlyhan"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.stationhead.com
                </a>{" "}
                để sử dụng trên web.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                {[{ src: "/1.png" }, { src: "/2.png" }].map((img, index) => (
                  <div
                    key={index}
                    data-aos="zoom-in"
                    data-aos-delay={index * 200}
                    className="bg-gray-50 p-6 rounded-2xl shadow-xl w-full"
                  >
                    <Image
                      src={img.src}
                      alt="Hướng dẫn Stationhead"
                      width={1000}
                      height={800}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="w-full bg-gray-50 p-10 rounded-2xl shadow-md"
            data-aos="fade-right"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1" data-aos="fade-right">
                <Image
                  src="/3.png"
                  alt="Đăng nhập Stationhead"
                  width={900}
                  height={700}
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>

              <div
                className="flex-1 text-center md:text-left"
                data-aos="fade-left"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  2. Lưu ý quan trọng khi stream trên Stationhead
                </h2>
                <ul className="text-lg text-gray-700 space-y-3 list-disc list-inside">
                  <li className="leading-relaxed">
                    Đăng nhập bằng tài khoản{" "}
                    <span className="font-semibold">Spotify</span> hoặc{" "}
                    <span className="font-semibold">Apple Music</span> premium
                    để có thể nghe và stream nhạc.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section
            className="w-full bg-gray-50 p-10 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-10"
            data-aos="fade-up"
          >
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                3. Một vài tips nhỏ
              </h3>
              <ul className="text-lg text-gray-700 space-y-3 list-disc list-inside">
                <li>
                  Tìm kiếm <span className="font-bold">WingsForLyhan</span> trên
                  Stationhead và các nền tảng khác.
                </li>
                <li>
                  Nhấn <span className="font-semibold">Follow</span> để ủng hộ.
                </li>
                <li>Tham gia cùng cộng đồng để tạo nhiều lượt stream hơn.</li>
              </ul>
            </div>
            <div className="md:w-1/2" data-aos="zoom-in-left">
              <Image
                src="/4.png"
                alt="Tìm station"
                width={900}
                height={700}
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </section>
        </div>
      </section>

      <section
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 z-10 relative"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-6">Nghe nhạc cùng LYHAN</h2>
        <SpotifyEmbed src="https://open.spotify.com/embed/artist/70swmqj7c3SHkkdf2SrSUy?utm_source=generator" />
      </section>

    </main>
  );
}


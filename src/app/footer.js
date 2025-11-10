"use client";
import { FaFacebook, FaInstagram, FaTwitter, FaSpotify, FaYoutube } from "react-icons/fa";
import { SiThreads } from "react-icons/si"; 

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">WINGS for LYHAN</h2>
          <p className="text-sm">
            Kết nối cùng cộng đồng fan và thưởng thức âm nhạc chất lượng.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Liên hệ</h2>
          <p className="text-sm">
            Email:{" "}
            <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=wingsforlyhan@gmail.com&su=Hỗ%20trợ%20fan%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                wingsforlyhan@gmail.com
          </a>

          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Theo dõi chúng tôi
          </h2>
          <div className="flex gap-4 text-2xl">
            <a href="https://www.facebook.com/profile.php?id=61581470604370" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="hover:text-blue-500 transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-pink-500 transition-colors" />
            </a>
            <a href="https://www.threads.com/@wingsforlyhan" target="_blank" rel="noopener noreferrer">
              <SiThreads className="hover:text-white transition-colors" />
            </a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
              <FaSpotify className="hover:text-green-500 transition-colors" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="hover:text-red-500 transition-colors" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} WINGSforLYHAN. All rights reserved.
      </div>
    </footer>
  );
}

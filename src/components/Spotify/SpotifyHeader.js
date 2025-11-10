import { motion } from "framer-motion";

export default function SpotifyHeader({ showStreamInput, setShowStreamInput }) {
  return (
    <div className="text-center">
      <h2 className="text-5xl font-bold mb-4">
        Thống kê Spotify Track
      </h2>
      <p className="text-xl text-gray-300 mb-4">
        Quản lý và theo dõi thống kê track Spotify của bạn
      </p>
      
      <button
        onClick={() => setShowStreamInput(true)}
        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-all duration-300 mb-4"
      >
        Nhập số liệu Streams
      </button>
    </div>
  );
}
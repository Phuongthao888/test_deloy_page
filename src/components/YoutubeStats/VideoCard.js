import { motion } from "framer-motion";

export default function VideoCard({ 
  video, 
  index, 
  viewVideoDetails 
}) {
  const handleWatchVideo = (e) => {
    e.stopPropagation();
    window.open(video.url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={() => viewVideoDetails(video)}
    >
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-32 md:h-48 object-cover rounded-lg mb-3 md:mb-4"
        />
        
        {/* Overlay hiện khi hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleWatchVideo}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 transform scale-90 group-hover:scale-100 text-sm md:text-base"
          >
            Xem Video
          </button>
        </div>
      </div>
      
      <h4 className="font-semibold text-base md:text-lg mb-2 line-clamp-2">{video.title}</h4>
      <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-1">{video.channel_title}</p>
      
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div className="flex justify-between">
          <span>Lượt xem:</span>
          <span className="font-semibold text-blue-300">{video.view_count}</span>
        </div>
        <div className="flex justify-between">
          <span>Lượt thích:</span>
          <span className="font-semibold text-green-300">{video.like_count}</span>
        </div>
        <div className="flex justify-between">
          <span>Bình luận:</span>
          <span className="font-semibold text-yellow-300">{video.comment_count}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10">
          <span>Thêm vào:</span>
          <span>{video.added_at}</span>
        </div>
      </div>
    </motion.div>
  );
}
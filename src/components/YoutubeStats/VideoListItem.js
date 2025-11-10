import { motion } from "framer-motion";

export default function VideoListItem({ 
  video, 
  index, 
  loading, 
  viewVideoDetails, 
  deleteVideo, 
  refreshVideoStats 
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
      className="bg-white/5 rounded-xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-3 md:gap-4"
      onClick={() => viewVideoDetails(video)}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 self-start">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-24 h-16 md:w-32 md:h-20 object-cover rounded-lg"
        />
        <button
          onClick={handleWatchVideo}
          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100"
        >
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
            Xem
          </span>
        </button>
      </div>

      {/* Thông tin video */}
      <div className="flex-grow min-w-0">
        <h4 className="font-semibold text-base md:text-lg mb-1 line-clamp-2 sm:line-clamp-1">{video.title}</h4>
        <p className="text-gray-400 text-xs md:text-sm mb-2 line-clamp-1">{video.channel_title}</p>
        
        <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-blue-300">Lượt xem: </span>
            <span className="font-semibold text-blue-300">{video.view_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-green-300">Thích </span>
            <span className="font-semibold text-green-300">{video.like_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-yellow-300">Bình luận </span>
            <span className="font-semibold text-yellow-300">{video.comment_count}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span className="hidden sm:inline">Thêm:</span>
            <span>{video.added_at}</span>
          </div>
        </div>
      </div>

      {/* Các nút chức năng */}
      <div className="flex sm:flex-col gap-2 flex-shrink-0 self-end sm:self-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            refreshVideoStats(video.url, video.video_id);
          }}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-1 text-xs md:text-sm"
          title="Cập nhật thống kê"
        >
          <span>Cập nhật</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteVideo(video.video_id);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-all duration-300 flex items-center gap-1 text-xs md:text-sm"
          title="Xóa video"
        >
          <span>Xóa</span>
        </button>
      </div>
    </motion.div>
  );
}
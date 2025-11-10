import { motion } from "framer-motion";
import { formatDuration, getPopularityColor } from './utils';

export default function SpotifyTrackListItem({ 
  track, 
  index, 
  loading, 
  viewTrackDetails, 
  deleteTrack, 
  refreshTrackStats 
}) {
  const handleOpenSpotify = (e) => {
    e.stopPropagation();
    window.open(track.external_url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-xl p-3 md:p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-3 md:gap-4"
      onClick={() => viewTrackDetails(track)}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 self-center sm:self-auto">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-20 h-20 sm:w-24 sm:h-16 md:w-32 md:h-20 object-cover rounded-lg"
        />
        <button
          onClick={handleOpenSpotify}
          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100"
        >
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
            Mở
          </span>
        </button>
      </div>

      {/* Thông tin track */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="mb-2">
          <h4 className="font-semibold text-sm md:text-base lg:text-lg mb-1 line-clamp-1">{track.title}</h4>
          <p className="text-gray-400 text-xs md:text-sm mb-1 line-clamp-1">{track.artist}</p>
          <p className="text-gray-400 text-xs md:text-sm mb-1 line-clamp-1">{track.album}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <span className={`font-semibold ${getPopularityColor(track.popularity)}`}>Độ phổ biến: </span>
            <span className={`font-semibold ${getPopularityColor(track.popularity)}`}>
              {track.popularity}/100
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-blue-300">Thời lượng: </span>
            <span className="font-semibold text-blue-300">
              {formatDuration(track.duration_ms)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Thêm vào: </span>
            <span>{track.added_at}</span>
          </div>
        </div>
      </div>

      {/* Các nút chức năng */}
      <div className="flex sm:flex-col gap-2 flex-shrink-0 self-end sm:self-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            refreshTrackStats(track.url, track.track_id);
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
            deleteTrack(track.track_id);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-all duration-300 flex items-center gap-1 text-xs md:text-sm"
          title="Xóa track"
        >
          <span>Xóa</span>
        </button>
      </div>
    </motion.div>
  );
}
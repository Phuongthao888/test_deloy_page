import { motion } from "framer-motion";
import { formatDuration, getPopularityColor } from './utils';

export default function SpotifyTrackCard({ 
  track, 
  index, 
  viewTrackDetails 
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
      className="bg-white/5 rounded-xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={() => viewTrackDetails(track)}
    >
      <div className="relative group">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg mb-3 md:mb-4"
        />
        
        {/* Overlay hiện khi hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleOpenSpotify}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 transform scale-90 group-hover:scale-100 text-sm md:text-base"
          >
            Mở Spotify
          </button>
        </div>
      </div>
      
      <h4 className="font-semibold text-base md:text-lg mb-2 line-clamp-2">{track.title}</h4>
      <p className="text-gray-400 text-xs md:text-sm mb-1 line-clamp-1">{track.artist}</p>
      <p className="text-gray-400 text-xs md:text-sm mb-1 line-clamp-1">{track.album}</p>
      
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div className="flex justify-between items-center">
          <span>Độ phổ biến:</span>
          <span className={`font-semibold ${getPopularityColor(track.popularity)}`}>
            {track.popularity}/100 
          </span>
        </div>
        <div className="flex justify-between">
          <span>Thời lượng:</span>
          <span className="font-semibold text-blue-300">
            {formatDuration(track.duration_ms)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10">
          <span>Thêm vào:</span>
          <span className="text-right">{track.added_at}</span>
        </div>
      </div>
    </motion.div>
  );
}
import { motion } from "framer-motion";
import SpotifyCharts from './SpotifyCharts';
import { formatDuration, formatReleaseDate, getPopularityColor, getPopularityEmoji } from './utils';

export default function SpotifyTrackDetails({
  selectedTrack,
  loading,
  refreshTrackStats,
  setActiveTab,
  onBack 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Chi tiết Track</h3>
        <div className="flex gap-2"> 
          {/* Back button */}
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Quay lại
            </button>
        </div>
      </div>

      {/* Track Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Album Art & Basic Info */}
        <div className="bg-white/5 rounded-xl p-6">
          <img
            src={selectedTrack.thumbnail}
            alt={selectedTrack.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h4 className="font-semibold text-xl mb-2">{selectedTrack.title}</h4>
          <p className="text-gray-400 text-lg mb-1">{selectedTrack.artist}</p>
          <p className="text-gray-500">{selectedTrack.album}</p>
          
          {selectedTrack.preview_url && (
            <div className="mt-4">
              <audio 
                controls 
                className="w-full"
                src={selectedTrack.preview_url}
              >
                Trình duyệt của bạn không hỗ trợ audio element.
              </audio>
            </div>
          )}
        </div>
        
        {/* Statistics */}
        <div className="bg-white/5 rounded-xl p-6">
          <h4 className="font-semibold text-lg mb-4">Thống kê Spotify</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Độ phổ biến:</span>
              <span className={`text-2xl font-bold ${getPopularityColor(selectedTrack.popularity)}`}>
                {selectedTrack.popularity}/100 {getPopularityEmoji(selectedTrack.popularity)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Thời lượng:</span>
              <span className="text-2xl font-bold text-blue-300">
                {formatDuration(selectedTrack.duration_ms)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="bg-white/5 rounded-xl p-6">
          <h4 className="font-semibold text-lg mb-4">Thông tin bổ sung</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Ngày phát hành:</span>
              <span>{formatReleaseDate(selectedTrack.release_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Thêm vào:</span>
              <span>{selectedTrack.added_at}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Track ID:</span>
              <span className="font-mono text-xs">{selectedTrack.track_id}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <a
                href={selectedTrack.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Mở trên Spotify
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spotify Charts */}
      <div className="mt-8">
        <SpotifyCharts 
          trackId={selectedTrack.track_id} 
          trackTitle={selectedTrack.title} 
        />
      </div>
    </motion.div>
  );
}
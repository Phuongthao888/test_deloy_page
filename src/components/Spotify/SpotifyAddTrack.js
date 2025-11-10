import { motion } from "framer-motion";
import { formatDuration, formatReleaseDate, getPopularityColor, getPopularityEmoji } from './utils';

export default function SpotifyAddTrack({
  url,
  setUrl,
  stats,
  loading,
  error,
  getSpotifyStats,
  saveTrack
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Dán link Spotify track tại đây..."
          className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
        />
        <div className="flex gap-2">
          <button
            onClick={getSpotifyStats}
            disabled={loading}
            className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Đang tải...' : 'Xem thống kê'}
          </button>
          {stats && (
            <button
              onClick={saveTrack}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg"
            >
              Thêm Track
            </button>
          )}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Results Section */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 rounded-2xl p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Track Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Thông tin Track</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Tên track</p>
                  <p className="text-lg font-semibold line-clamp-2">{stats.title}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Nghệ sĩ</p>
                  <p className="text-lg">{stats.artist}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Album</p>
                  <p className="text-lg">{stats.album}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Ngày phát hành</p>
                  <p className="text-lg">{formatReleaseDate(stats.release_date)}</p>
                </div>
              </div>

              {/* Album Art */}
              <div className="mt-6">
                <img
                  src={stats.thumbnail}
                  alt="Album art"
                  className="rounded-xl w-full max-w-sm h-auto shadow-lg mx-auto"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Thống kê Spotify</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">{getPopularityEmoji(stats.popularity)}</span>
                    <p className={`text-4xl font-bold ${getPopularityColor(stats.popularity)}`}>
                      {stats.popularity}/100
                    </p>
                  </div>
                  <p className="text-gray-400">Độ phổ biến</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                  <p className="text-4xl font-bold text-blue-300 mb-2">
                    {formatDuration(stats.duration_ms)}
                  </p>
                  <p className="text-gray-400">Thời lượng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview & External Link */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-4 justify-center">
              {stats.preview_url && (
                <audio 
                  controls 
                  className="w-full max-w-md"
                  src={stats.preview_url}
                >
                  Trình duyệt của bạn không hỗ trợ audio element.
                </audio>
              )}
              <a
                href={stats.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
              >
                Mở trên Spotify
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
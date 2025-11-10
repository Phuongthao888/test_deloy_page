import { motion } from "framer-motion";

export default function AddVideoTab({ 
  url, 
  setUrl, 
  stats, 
  loading, 
  error, 
  getVideoStats, 
  saveVideo 
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
          placeholder="Dán link YouTube video tại đây..."
          className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
        <div className="flex gap-2">
          <button
            onClick={getVideoStats}
            disabled={loading}
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Đang tải...' : 'Xem thống kê'}
          </button>
          {stats && (
            <button
              onClick={saveVideo}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg"
            >
              Thêm Video
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

      {stats && <VideoStatsDisplay stats={stats} />}
    </motion.div>
  );
}

function VideoStatsDisplay({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 rounded-2xl p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Info */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4">Thông tin Video</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Tiêu đề</p>
              <p className="text-lg font-semibold line-clamp-2">{stats.title}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Kênh</p>
              <p className="text-lg">{stats.channel_title}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Ngày đăng</p>
              <p className="text-lg">{stats.published_at}</p>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="mt-6">
            <img
              src={stats.thumbnail}
              alt="Video thumbnail"
              className="rounded-xl w-full h-auto shadow-lg"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4">Thống kê</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <p className="text-4xl font-bold text-blue-300 mb-2">{stats.view_count}</p>
              <p className="text-gray-400">Lượt xem</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <p className="text-4xl font-bold text-green-300 mb-2">{stats.like_count}</p>
              <p className="text-gray-400">Lượt thích</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <p className="text-4xl font-bold text-yellow-300 mb-2">{stats.comment_count}</p>
              <p className="text-gray-400">Bình luận</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
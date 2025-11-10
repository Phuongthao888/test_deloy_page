import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import StatsChart from './StatsChart';
import DailyStatsChart from './DailyStatsChart';

export default function VideoDetailsTab({
  selectedVideo,
  chartData,
  dailyChartData,
  chartLoading,
  dailyChartLoading,
  loading,
  onBack,
  refreshVideoStats,
  loadChartData,
  loadDailyChartData
}) {
  const [activeChartTab, setActiveChartTab] = useState('detailed');

  useEffect(() => {
    if (selectedVideo) {
      loadChartData(selectedVideo.video_id);
      setActiveChartTab('detailed');
    }
  }, [selectedVideo]);

  const handleDetailedTabClick = () => {
    setActiveChartTab('detailed');
    loadChartData(selectedVideo.video_id);
  };

  const handleDailyTabClick = () => {
    setActiveChartTab('daily');
    loadDailyChartData(selectedVideo.video_id);
  };

  const handleWatchVideo = () => {
    window.open(selectedVideo.url, '_blank');
  };

  const handleRefreshStats = () => {
    refreshVideoStats(selectedVideo.url, selectedVideo.video_id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Biểu đồ thống kê</h3>
        <div className="flex gap-2">
          {/* <button
            onClick={handleRefreshStats}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật thống kê'}
          </button> */}
          <button
            onClick={handleWatchVideo}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
          >
            Xem Video
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold transition-all duration-300"
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* Video Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl p-6">
          <img
            src={selectedVideo.thumbnail}
            alt={selectedVideo.title}
            className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
            onClick={handleWatchVideo}
          />
          <h4 className="font-semibold text-lg mb-2">{selectedVideo.title}</h4>
          <p className="text-gray-400 text-sm">{selectedVideo.channel_title}</p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6">
          <h4 className="font-semibold text-lg mb-4">Thống kê hiện tại</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lượt xem:</span>
              <span className="text-2xl font-bold text-blue-300">{selectedVideo.view_count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lượt thích:</span>
              <span className="text-2xl font-bold text-green-300">{selectedVideo.like_count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Bình luận:</span>
              <span className="text-2xl font-bold text-yellow-300">{selectedVideo.comment_count}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6">
          <h4 className="font-semibold text-lg mb-4">Thông tin</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Ngày đăng:</span>
              <span>{selectedVideo.published_at}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Thêm vào:</span>
              <span>{selectedVideo.added_at}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Video ID:</span>
              <span className="font-mono text-xs">{selectedVideo.video_id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab cho các loại biểu đồ */}
      <div className="mb-6">
        <div className="flex border-b border-gray-600">
          <button
            onClick={handleDetailedTabClick}
            className={`px-4 py-2 font-semibold transition-all duration-300 ${
              activeChartTab === 'detailed' 
                ? 'border-b-2 border-blue-500 text-blue-300' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Biểu đồ chi tiết
          </button>
          <button
            onClick={handleDailyTabClick}
            className={`px-4 py-2 font-semibold transition-all duration-300 ${
              activeChartTab === 'daily' 
                ? 'border-b-2 border-blue-500 text-blue-300' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Biểu đồ theo ngày
          </button>
        </div>
      </div>

      {/* Hiển thị biểu đồ tương ứng */}
      {activeChartTab === 'detailed' && (
        <StatsChart chartData={chartData} chartLoading={chartLoading} />
      )}
      
      {activeChartTab === 'daily' && (
        <DailyStatsChart chartData={dailyChartData} chartLoading={dailyChartLoading} />
      )}

      {/* Hiển thị thông báo khi không có dữ liệu */}
      {activeChartTab === 'detailed' && !chartData && !chartLoading && (
        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-400 text-center">
              <p>Chưa có dữ liệu biểu đồ chi tiết.</p>
              <p className="mt-2">Hãy cập nhật thống kê để xem biểu đồ.</p>
            </div>
          </div>
        </div>
      )}

      {activeChartTab === 'daily' && !dailyChartData && !dailyChartLoading && (
        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-400 text-center">
              <p>Chưa có đủ dữ liệu để vẽ biểu đồ ngày.</p>
              <p className="mt-2">Cần ít nhất 2 ngày dữ liệu để so sánh.</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import VideoListItem from './VideoListItem';

export default function VideoListTab({ 
  savedVideos, 
  loading, 
  viewVideoDetails, 
  deleteVideo, 
  refreshVideoStats
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Video Đã Lưu</h3> 
      </div>
      
      {savedVideos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Chưa có video nào được lưu</p>
          <p className="mt-2">Hãy thêm video mới từ tab "Thêm Video Mới"</p>
        </div>
      ) : (
        <>
          {/* Section List View - Cho admin quản lý */}
          <section className="max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <AnimatePresence>
                {savedVideos.map((video, index) => (
                  <VideoListItem
                    key={`list-${video.video_id}`}
                    video={video}
                    index={index}
                    loading={loading}
                    viewVideoDetails={viewVideoDetails}
                    deleteVideo={deleteVideo}
                    refreshVideoStats={refreshVideoStats}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        </>
      )}
    </motion.div>
  );
}
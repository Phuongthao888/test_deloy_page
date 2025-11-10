import { motion, AnimatePresence } from "framer-motion";
import SpotifyTrackListItem from './SpotifyTrackListItem';

export default function SpotifyTrackList({
  savedTracks,
  loading,
  viewTrackDetails,
  deleteTrack,
  refreshTrackStats,
  onBack 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Track Đã Lưu</h3>
        <div className="text-sm text-gray-400">
          {savedTracks.length} tracks
        </div>
      </div>
      
      {savedTracks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Chưa có track nào được lưu</p>
          <p className="mt-2">Hãy thêm track mới từ tab "Thêm Track Mới"</p>
        </div>
      ) : (
        <>
        {/* Section List View - Cho admin quản lý */}
          <section className="max-h-[70vh] overflow-y-auto"> 
            <div className="space-y-4">
              <AnimatePresence>
                {savedTracks.map((track, index) => (
                  <SpotifyTrackListItem
                    key={`list-${track.track_id}`}
                    track={track}
                    index={index}
                    loading={loading}
                    viewTrackDetails={viewTrackDetails}
                    deleteTrack={deleteTrack}
                    refreshTrackStats={refreshTrackStats}
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
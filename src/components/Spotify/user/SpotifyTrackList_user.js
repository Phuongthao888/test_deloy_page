import { motion, AnimatePresence } from "framer-motion";
import SpotifyTrackCard from '../SpotifyTrackCard';
import '../../../app/globals.css';
export default function SpotifyTrackList({
  savedTracks,
  loading,
  viewTrackDetails,
  deleteTrack,
  refreshTrackStats
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
          {/* Section Card View - Cho user xem */}
          <section className="mb-12 max-h-[450px] overflow-y-auto scrollbar-hide"> 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {savedTracks.map((track, index) => (
                  <SpotifyTrackCard
                    key={`card-${track.track_id}`}
                    track={track}
                    index={index}
                    viewTrackDetails={viewTrackDetails}
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
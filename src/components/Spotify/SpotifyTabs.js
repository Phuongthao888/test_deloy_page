export default function SpotifyTabs({ activeTab, setActiveTab, selectedTrack, savedTracksCount }) {
  return (
    <div className="flex space-x-4 mb-8 justify-center flex-wrap">
      <button
        onClick={() => setActiveTab("add")}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          activeTab === "add" 
            ? "bg-emerald-500 text-white shadow-lg" 
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        Thêm Track Mới
      </button>
      <button
        onClick={() => setActiveTab("list")}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          activeTab === "list" 
            ? "bg-emerald-500 text-white shadow-lg" 
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        Track Đã Lưu ({savedTracksCount})
      </button>
      {selectedTrack && (
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "details" 
              ? "bg-emerald-500 text-white shadow-lg" 
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          Chi tiết
        </button>
      )}
    </div>
  );
}
export default function TabNavigation({ activeTab, setActiveTab, selectedVideo, savedVideosCount }) {
  return (
    <div className="flex space-x-4 mb-8 justify-center flex-wrap">
      <button
        onClick={() => setActiveTab("add")}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          activeTab === "add" 
            ? "bg-blue-500 text-white shadow-lg" 
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        Thêm Video Mới
      </button>
      <button
        onClick={() => setActiveTab("list")}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          activeTab === "list" 
            ? "bg-blue-500 text-white shadow-lg" 
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        Video Đã Lưu ({savedVideosCount})
      </button>
      {/* {selectedVideo && (
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "details" 
              ? "bg-blue-500 text-white shadow-lg" 
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          Biểu đồ
        </button>
      )} */}
    </div>
  );
}
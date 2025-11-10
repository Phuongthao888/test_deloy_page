export default function AutoUpdateStatus({ 
  autoUpdate, 
  lastUpdate, 
  updateCount, 
  manuallyUpdateStats 
}) {
  return (
    <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
      {autoUpdate && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm">Đang cập nhật tự động (mỗi phút)</span>
        </div>
      )}
      
      <button
        onClick={manuallyUpdateStats}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-sm transition-all duration-300"
      >
        CẬP NHẬT NGAY
      </button>

      {lastUpdate && (
        <div className="text-sm text-gray-400">
          Cập nhật lúc: {lastUpdate} (Lần: {updateCount})
        </div>
      )}
    </div>
  );
}
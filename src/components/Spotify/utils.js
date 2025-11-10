// Format duration từ milliseconds sang phút:giây
export const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format release date
export const formatReleaseDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
};

// Hàm để lấy màu sắc dựa trên độ phổ biến
export const getPopularityColor = (popularity) => {
  if (popularity >= 80) return 'text-green-400';
  if (popularity >= 60) return 'text-yellow-400';
  if (popularity >= 40) return 'text-orange-400';
  return 'text-red-400';
};

// Hàm để lấy emoji dựa trên độ phổ biến
export const getPopularityEmoji = (popularity) => {
  if (popularity >= 80) return '🔥';
  if (popularity >= 60) return '⭐';
  if (popularity >= 40) return '↗️';
  return '📊';
};
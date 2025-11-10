"use client";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE = process.env.NEXT_PUBLIC_SPOTIFY_API_URL || 'https://realtime-statistics-spotify.onrender.com/api';

// Hàm format ngày tháng
const formatDateDisplay = (dateString) => {
  try {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Hàm lấy ngày hôm qua
const getYesterdayDate = (currentDateString) => {
  try {
    const [day, month, year] = currentDateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return "hôm qua";
  }
};

// Chart options cho biểu đồ TỔNG STREAMS
const getTotalStreamChartOptions = (isMobile) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#E5E7EB',
        font: {
          size: isMobile ? 12 : 14
        }
      }
    },
    title: {
      display: true,
      text: 'Tổng Streams Theo Thời Gian',
      color: '#E5E7EB',
      font: {
        size: isMobile ? 14 : 16,
        weight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#E5E7EB',
      bodyColor: '#E5E7EB',
      borderColor: '#4B5563',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' streams';
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#9CA3AF',
        maxRotation: isMobile ? 45 : 0,
        font: {
          size: isMobile ? 10 : 12
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      title: {
        display: true,
        text: 'Ngày',
        color: '#9CA3AF',
        font: {
          size: isMobile ? 11 : 12
        }
      }
    },
    y: {
      ticks: {
        color: '#10B981',
        callback: function(value) {
          return new Intl.NumberFormat('vi-VN').format(value);
        },
        font: {
          size: isMobile ? 10 : 12
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      title: {
        display: true,
        text: 'Tổng Streams',
        color: '#10B981',
        font: {
          size: isMobile ? 11 : 12
        }
      },
    },
  },
});

// Chart options cho biểu đồ CHI TIẾT
const getDetailChartOptions = (isMobile) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#E5E7EB',
        font: {
          size: isMobile ? 12 : 14
        }
      }
    },
    title: {
      display: true,
      text: 'Chi Tiết Streams Hàng Ngày',
      color: '#E5E7EB',
      font: {
        size: isMobile ? 14 : 16,
        weight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#E5E7EB',
      bodyColor: '#E5E7EB',
      borderColor: '#4B5563',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            const value = new Intl.NumberFormat('vi-VN').format(context.parsed.y);
            if (context.dataset.label === 'Tăng/Giảm') {
              label += (context.parsed.y >= 0 ? '+' : '') + value;
            } else {
              label += value + ' streams';
            }
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#9CA3AF',
        maxRotation: isMobile ? 45 : 0,
        font: {
          size: isMobile ? 10 : 12
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      title: {
        display: true,
        text: 'Ngày',
        color: '#9CA3AF',
        font: {
          size: isMobile ? 11 : 12
        }
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      ticks: {
        color: '#3B82F6',
        callback: function(value) {
          return new Intl.NumberFormat('vi-VN').format(value);
        },
        font: {
          size: isMobile ? 10 : 12
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      title: {
        display: true,
        text: 'Streams Hàng Ngày',
        color: '#3B82F6',
        font: {
          size: isMobile ? 11 : 12
        }
      },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      ticks: {
        color: '#f46969ff',
        callback: function(value) {
          return new Intl.NumberFormat('vi-VN').format(value);
        },
        font: {
          size: isMobile ? 10 : 12
        }
      },
      grid: {
        drawOnChartArea: false,
      },
      title: {
        display: true,
        text: 'Tăng/Giảm',
        color: '#f46969ff',
        font: {
          size: isMobile ? 11 : 12
        }
      },
    },
  },
});

export default function SpotifyCharts({ trackId, trackTitle }) {
  const [totalStreamChartData, setTotalStreamChartData] = useState(null);
  const [detailChartData, setDetailChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [yesterdayDate, setYesterdayDate] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (trackId) {
      loadChartData();
    }
  }, [trackId]);

  const loadChartData = async () => {
    if (!trackId) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/spotify/streams/${trackId}/recent?days=7`);
      const data = await response.json();

      if (data.success && data.streams.length > 0) {
        const streams = data.streams;
        
        // Lấy ngày hiện tại và ngày hôm qua
        const latestDate = streams[streams.length - 1]?.date;
        if (latestDate) {
          setCurrentDate(formatDateDisplay(latestDate));
          setYesterdayDate(getYesterdayDate(latestDate));
        }
        
        // Biểu đồ TỔNG STREAMS
        const totalStreamData = {
          labels: streams.map(stream => formatDateDisplay(stream.date)),
          datasets: [
            {
              label: 'Tổng Streams',
              data: streams.map(stream => stream.total_streams || 0),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: isMobile ? 2 : 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#10B981',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: isMobile ? 4 : 6,
              pointHoverRadius: isMobile ? 6 : 8
            }
          ]
        };
        setTotalStreamChartData(totalStreamData);

        // Biểu đồ CHI TIẾT
        const detailData = {
          labels: streams.map(stream => formatDateDisplay(stream.date)),
          datasets: [
            {
              label: 'Streams Hàng Ngày',
              data: streams.map(stream => stream.daily_streams || 0),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: isMobile ? 2 : 3,
              tension: 0.3,
              fill: true,
              yAxisID: 'y',
              pointBackgroundColor: '#3B82F6',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: isMobile ? 3 : 5,
              pointHoverRadius: isMobile ? 5 : 7
            },
            {
              label: 'Tăng/Giảm',
              data: streams.map(stream => stream.change || 0),
              borderColor: '#f46969ff',
              backgroundColor: 'rgba(244, 105, 105, 0.1)',
              borderWidth: isMobile ? 2 : 3,
              tension: 0.3,
              fill: false,
              yAxisID: 'y1',
              borderDash: [5, 5],
              pointBackgroundColor: '#f46969ff',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: isMobile ? 3 : 5,
              pointHoverRadius: isMobile ? 5 : 7
            }
          ]
        };
        setDetailChartData(detailData);
      } else {
        setTotalStreamChartData(null);
        setDetailChartData(null);
        setError("Không có đủ dữ liệu để hiển thị biểu đồ");
      }

    } catch (err) {
      setError("Không thể tải dữ liệu biểu đồ");
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400">Đang tải biểu đồ...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400 text-center">
            <p>{error}</p>
            <p className="mt-2 text-sm md:text-base">Hãy nhập số liệu streams để xem biểu đồ.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!totalStreamChartData && !detailChartData) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400 text-center">
            <p>Chưa có dữ liệu streams cho track này.</p>
            <p className="mt-2 text-sm md:text-base">Hãy nhập số liệu streams để xem biểu đồ.</p>
          </div>
        </div>
      </div>
    );
  }

  // Tính toán số liệu hiện tại
  const currentTotal = totalStreamChartData?.datasets[0].data[totalStreamChartData.datasets[0].data.length - 1] || 0;
  const currentDaily = detailChartData?.datasets[0].data[detailChartData.datasets[0].data.length - 1] || 0;
  const currentChange = detailChartData?.datasets[1].data[detailChartData.datasets[1].data.length - 1] || 0;

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Data Summary - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/10">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400 mb-1 md:mb-2">
            {currentTotal.toLocaleString('vi-VN')}
          </div>
          <div className="text-gray-300 text-sm md:text-lg font-medium">Tổng Streams Hiện Tại</div>
        </div>
        
        <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/10">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 mb-1 md:mb-2">
            {currentDaily.toLocaleString('vi-VN')}
          </div>
          <div className="text-gray-300 text-sm md:text-lg font-medium">
            Streams ngày {currentDate}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/10">
          <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${
            currentChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {(currentChange >= 0 ? '+' : '') + currentChange.toLocaleString('vi-VN')}
          </div>
          <div className="text-gray-300 text-sm md:text-lg font-medium">
            So với ngày {yesterdayDate}
          </div>
        </div>
      </div>

      {/* Biểu đồ TỔNG STREAMS */}
      {totalStreamChartData && (
        <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
          <div className="h-60 sm:h-72 md:h-80">
            <Line 
              data={totalStreamChartData} 
              options={getTotalStreamChartOptions(isMobile)} 
            />
          </div>
        </div>
      )}

      {/* Biểu đồ CHI TIẾT */}
      {detailChartData && (
        <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
          <div className="h-60 sm:h-72 md:h-80">
            <Line 
              data={detailChartData} 
              options={getDetailChartOptions(isMobile)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
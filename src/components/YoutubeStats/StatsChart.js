import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
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
          size: 12 // Nhỏ hơn cho mobile
        }
      }
    },
    title: {
      display: true,
      text: 'Biểu đồ thống kê - Thể hiện số lượng tăng theo thời gian',
      color: '#E5E7EB',
      font: {
        size: 14, // Nhỏ hơn cho mobile
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
            label += new Intl.NumberFormat('vi-VN').format(context.parsed.y);
            
            if (context.dataset.label?.includes('Lượt xem')) {
              label += ' lượt xem';
            } else if (context.dataset.label?.includes('Lượt thích')) {
              label += ' lượt thích';
            } else if (context.dataset.label?.includes('Bình luận')) {
              label += ' bình luận';
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
        maxRotation: 45, // Xoay nhãn cho mobile
        minRotation: 45
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      title: {
        display: true,
        text: 'Thời gian',
        color: '#9CA3AF'
      }
    },
    y: {
      ticks: {
        color: '#60A5FA',
        callback: function(value) {
          return new Intl.NumberFormat('vi-VN').format(value);
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      title: {
        display: true,
        text: 'Số lượng tăng',
        color: '#60A5FA'
      },
      beginAtZero: true
    },
  },
};

export default function StatsChart({ chartData, chartLoading }) {
  
  const transformChartData = (originalData, maxDataPoints = 20) => { // Giảm điểm dữ liệu cho mobile
    if (!originalData || !originalData.labels || !originalData.datasets) {
      return null;
    }

    const recentLabels = originalData.labels.slice(-maxDataPoints);
    const recentDatasets = originalData.datasets.map(dataset => {
      const recentData = dataset.data.slice(-maxDataPoints);
      
      if (recentData.length === 0) return dataset;

      const baseValue = recentData[0];
      const transformedData = recentData.map(value => value - baseValue);
      
      return {
        ...dataset,
        data: transformedData,
        label: dataset.label ? `Tăng ${dataset.label.toLowerCase()}` : dataset.label
      };
    });

    return {
      labels: recentLabels,
      datasets: recentDatasets
    };
  };

  const getFormattedChartData = () => {
    if (!chartData) return null;

    const transformedData = transformChartData(chartData, 20); // Giới hạn 20 điểm cho mobile
    if (!transformedData) return null;

    return {
      labels: transformedData.labels,
      datasets: transformedData.datasets.map(dataset => ({
        ...dataset,
        borderWidth: 2, // Mỏng hơn cho mobile
        tension: 0.2,
        pointBackgroundColor: dataset.borderColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 1, // Mỏng hơn cho mobile
        pointRadius: 3, // Nhỏ hơn cho mobile
        pointHoverRadius: 6,
        fill: false
      }))
    };
  };

  if (chartLoading) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400">Đang tải biểu đồ...</div>
        </div>
      </div>
    );
  }

  const formattedData = getFormattedChartData();

  if (!chartData || !formattedData) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400 text-center">
            <p>Chưa có đủ dữ liệu để vẽ biểu đồ.</p>
            <p className="mt-2 text-sm md:text-base">Hãy cập nhật thống kê vài lần để xem xu hướng.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-xl p-4 md:p-6">
      <div className="h-64 md:h-96"> {/* Chiều cao responsive */}
        <Line data={formattedData} options={chartOptions} />
      </div>
    </div>
  );
}
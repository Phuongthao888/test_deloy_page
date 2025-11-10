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
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#E5E5E5',
        font: {
          size: 12 // Nhỏ hơn cho mobile
        }
      }
    },
    title: {
      display: true,
      color: '#E5E5E5',
      font: {
        size: 14, // Nhỏ hơn cho mobile
        weight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#E5E5E5',
      bodyColor: '#E5E5E5',
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
        maxRotation: 45,
        minRotation: 45
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      title: {
        display: true,
        text: 'Ngày',
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
        text: 'Số lượng',
        color: '#60A5FA'
      },
      beginAtZero: true
    },
  },
};

function SingleChart({ title, data, color, loading }) {
  if (loading) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400">Đang tải biểu đồ...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400 text-center">
            <p>Chưa có đủ dữ liệu để vẽ biểu đồ.</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.data,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 3,
      }
    ]
  };

  const options = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: title,
      }
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 md:p-6">
      <div className="h-48 md:h-64"> {/* Chiều cao responsive */}
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default function DailyStatsChart({ chartData, chartLoading }) {
  if (chartLoading) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400">Đang tải biểu đồ ngày...</div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-base md:text-lg text-gray-400 text-center">
            <p>Chưa có đủ dữ liệu để vẽ biểu đồ ngày.</p>
            <p className="mt-2 text-sm md:text-base">Cần ít nhất 2 ngày dữ liệu để so sánh.</p>
          </div>
        </div>
      </div>
    );
  }

  const viewsData = {
    labels: chartData.labels,
    data: chartData.datasets[0]?.data || []
  };

  const likesData = {
    labels: chartData.labels,
    data: chartData.datasets[1]?.data || []
  };

  const commentsData = {
    labels: chartData.labels,
    data: chartData.datasets[2]?.data || []
  };

  return (
    <div className="space-y-4 md:space-y-6"> {/* Khoảng cách responsive */}
      <SingleChart 
        title="Lượt xem theo ngày"
        data={viewsData}
        color="#3B82F6"
        loading={chartLoading}
      />

      <SingleChart 
        title="Lượt thích theo ngày"
        data={likesData}
        color="#10B981"
        loading={chartLoading}
      />

      <SingleChart 
        title="Bình luận theo ngày"
        data={commentsData}
        color="#8B5CF6"
        loading={chartLoading}
      />
    </div>
  );
}
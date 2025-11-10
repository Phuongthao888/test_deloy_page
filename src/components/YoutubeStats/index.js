"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from './Header';
import TabNavigation from './TabNavigation';
import AddVideoTab from './AddVideoTab';
import VideoListTab_admin from './VideoListTab_admin';
import VideoDetailsTab from './VideoDetailsTab';

// Sử dụng environment variable hoặc URL mặc định
const API_BASE = process.env.NEXT_PUBLIC_YTB_API_URL || 'https://statistics-1lcg.onrender.com/api';

export default function YoutubeStats() {
  const [url, setUrl] = useState("");
  const [stats, setStats] = useState(null);
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [dailyChartData, setDailyChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [dailyChartLoading, setDailyChartLoading] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [serverHealth, setServerHealth] = useState('unknown');

  // Load saved videos khi component mount
  useEffect(() => {
    console.log('Component mounted');
    console.log('API Base URL:', API_BASE);
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await checkServerHealth();
    await loadSavedVideos();
  };

  const checkServerHealth = async () => {
    try {
      console.log('Kiểm tra server tại:', `${API_BASE}/health`);
      
      const response = await fetch(`${API_BASE}/health`);
      console.log('Health check response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Health check data:', data);
      
      if (data.success) {
        setServerHealth('healthy');
        setError('');
        console.log('Server healthy');
        return true;
      } else {
        setServerHealth('unhealthy');
        setError(`Server lỗi: ${data.error}`);
        console.error('Server unhealthy:', data.error);
        return false;
      }
    } catch (err) {
      setServerHealth('disconnected');
      const errorMsg = `Không thể kết nối đến server: ${err?.message || 'Unknown error'}`;
      setError(errorMsg);
      console.error('Server disconnected:', err);
      return false;
    }
  };

  const loadSavedVideos = async () => {
    try {
      console.log(`Loading videos from: ${API_BASE}/videos`);
      const response = await fetch(`${API_BASE}/videos`);
      console.log('Videos response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Videos data:', data);
      
      if (data.success) {
        setSavedVideos(data.videos);
        console.log(`Loaded ${data.videos.length} videos`);
        return data.videos;
      } else {
        console.error('API error:', data.error);
        setError(data.error || 'Lỗi khi tải video');
        return [];
      }
    } catch (err) {
      console.error('Error loading videos:', err);
      const errorMsg = `Không thể kết nối đến server: ${err?.message || 'Unknown error'}`;
      setError(errorMsg);
      return [];
    }
  };

  const updateAllStats = async () => {
    if (savedVideos.length === 0) {
      console.log('Không có video nào để cập nhật');
      return;
    }

    try {
      console.log('Đang cập nhật thống kê...');
      
      const response = await fetch(`${API_BASE}/update-all-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Update-all-stats response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Update-all-stats data:', data);

      if (data.success) {
        const updatedVideos = await loadSavedVideos();
        setLastUpdate(new Date().toLocaleTimeString());
        setUpdateCount(prev => prev + 1);
        
        if (selectedVideo) {
          const updatedVideo = updatedVideos.find(v => v.video_id === selectedVideo.video_id);
          if (updatedVideo) {
            setSelectedVideo(updatedVideo);
            await loadChartData(selectedVideo.video_id);
          }
        }
        
        console.log('Đã cập nhật thống kê');
        setError('');
      } else {
        console.error('Lỗi cập nhật:', data.error);
        setError(data.error || 'Lỗi khi cập nhật thống kê');
      }
    } catch (err) {
      console.error('Lỗi kết nối khi cập nhật:', err);
      const errorMsg = `Không thể kết nối đến server: ${err?.message || 'Unknown error'}`;
      setError(errorMsg);
    }
  };

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/,
      /youtube\.com\/embed\/([^&?\s]+)/
    ];
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getVideoStats = async () => {
    if (!url) {
      setError("Vui lòng nhập URL YouTube");
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("URL YouTube không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");
    setStats(null);

    try {
      console.log('Gửi request video-stats với URL:', url);
      const response = await fetch(`${API_BASE}/video-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, update_history: true })
      });

      console.log('Video-stats response status:', response.status);

      const data = await response.json();
      console.log('Video-stats data:', data);

      if (data.success) {
        setStats(data);
        setActiveTab("add");
      } else {
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Error in getVideoStats:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const saveVideo = async () => {
    if (!stats) return;

    try {
      const response = await fetch(`${API_BASE}/save-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video: stats })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Đã lưu video thành công!');
        setUrl("");
        setStats(null);
        await loadSavedVideos();
        setActiveTab("list");
      } else {
        alert(data.error || 'Không thể lưu video');
        setError(data.error || 'Không thể lưu video');
      }
    } catch (err) {
      const errorMsg = 'Không thể kết nối đến server';
      alert(errorMsg);
      setError(errorMsg);
      console.error('Error:', err);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!confirm('Bạn có chắc muốn xóa video này?')) return;

    try {
      const response = await fetch(`${API_BASE}/delete-video/${videoId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Đã xóa video thành công!');
        await loadSavedVideos();
        if (selectedVideo && selectedVideo.video_id === videoId) {
          setSelectedVideo(null);
          setChartData(null);
          setDailyChartData(null);
        }
      } else {
        alert(data.error || 'Không thể xóa video');
      }
    } catch (err) {
      alert('Không thể kết nối đến server');
      console.error('Error:', err);
    }
  };

  const refreshVideoStats = async (videoUrl, videoId) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE}/video-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: videoUrl, 
          update_history: true 
        })
      });

      const data = await response.json();

      if (data.success) {
        await loadSavedVideos();
        
        if (selectedVideo && selectedVideo.video_id === videoId) {
          setSelectedVideo(data);
          loadChartData(videoId);
        }
        
        alert('Đã cập nhật thống kê mới nhất!');
      } else {
        setError(data.error || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async (videoId) => {
    setChartLoading(true);
    try {
      const response = await fetch(`${API_BASE}/stats-history/${videoId}?days=60`);
      const data = await response.json();
      
      if (data.success) {
        setChartData(data.chart_data);
        setDailyChartData(null);
      } else {
        console.error('Error loading chart data:', data.error);
        setChartData(null);
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
      setChartData(null);
    } finally {
      setChartLoading(false);
    }
  };

  const loadDailyChartData = async (videoId) => {
    setDailyChartLoading(true);
    try {
      const response = await fetch(`${API_BASE}/daily-stats/${videoId}?days=60`);
      const data = await response.json();
      
      if (data.success) {
        setDailyChartData(data.chart_data);
        setChartData(null);
      } else {
        console.error('Error loading daily stats:', data.error);
        setDailyChartData(null);
      }
    } catch (error) {
      console.error('Error loading daily chart:', error);
      setDailyChartData(null);
    } finally {
      setDailyChartLoading(false);
    }
  };

  const viewVideoDetails = async (video) => {
    setSelectedVideo(video);
    setActiveTab("details");
    await loadChartData(video.video_id);
  };

  const handleBackFromDetails = () => {
    setSelectedVideo(null);
    setActiveTab("list");
  };

  const toggleAutoUpdate = () => {
    alert('Tính năng auto update đang tạm thời bị vô hiệu hóa để debug.');
    setAutoUpdate(false);
  };

  const manuallyUpdateStats = () => {
    updateAllStats();
  };

  const retryConnection = async () => {
    console.log('Retrying connection...');
    setError('');
    await initializeApp();
  };

  const testConnection = async () => {
    console.log('Testing connection manually...');
    await checkServerHealth();
  };

  // Thêm hàm format thời gian Việt Nam
  const formatVietnamTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      // Chuyển đổi sang timezone Việt Nam (UTC+7)
      const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Intl.DateTimeFormat('vi-VN', options).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Sử dụng trong component
  const getCurrentVietnamTime = () => {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(now);
  };

  return (
    <section 
      className="min-h-screen w-full text-white px-6 py-20"
      style={{
        backgroundImage: 'url("/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">⚠️</span>
                  <span className="text-red-100">{error}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={testConnection}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Test Connection
                  </button>
                  <button
                    onClick={retryConnection}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <Header 
            autoUpdate={autoUpdate}
            lastUpdate={lastUpdate}
            updateCount={updateCount}
            toggleAutoUpdate={toggleAutoUpdate}
            manuallyUpdateStats={manuallyUpdateStats}
            serverHealth={serverHealth}
          />

          <TabNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedVideo={selectedVideo}
            savedVideosCount={savedVideos.length}
          />

          {activeTab === "add" && (
            <AddVideoTab
              url={url}
              setUrl={setUrl}
              stats={stats}
              loading={loading}
              error={error}
              getVideoStats={getVideoStats}
              saveVideo={saveVideo}
            />
          )}
          
          {activeTab === "list" && (
            <VideoListTab_admin
              savedVideos={savedVideos}
              loading={loading}
              viewVideoDetails={viewVideoDetails}
              deleteVideo={deleteVideo}
              refreshVideoStats={refreshVideoStats}
            />
          )}

          {activeTab === "details" && selectedVideo && (
            <VideoDetailsTab
              selectedVideo={selectedVideo}
              chartData={chartData}
              dailyChartData={dailyChartData}
              chartLoading={chartLoading}
              dailyChartLoading={dailyChartLoading}
              loading={loading}
              onBack={handleBackFromDetails}
              refreshVideoStats={refreshVideoStats}
              loadChartData={loadChartData}
              loadDailyChartData={loadDailyChartData}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
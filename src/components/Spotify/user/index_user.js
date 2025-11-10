"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import SpotifyTrackList_user from './SpotifyTrackList_user';
import SpotifyTrackDetails from '../SpotifyTrackDetails';

// Sử dụng environment variable hoặc URL mặc định
const API_BASE = process.env.NEXT_PUBLIC_SPOTIFY_API_URL || 'https://realtime-statistics-spotify.onrender.com/api';

export default function SpotifyStats() {
  const [url, setUrl] = useState("");
  const [stats, setStats] = useState(null);
  const [savedTracks, setSavedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showStreamInput, setShowStreamInput] = useState(false);

  // Load saved tracks khi component mount
  useEffect(() => {
    loadSavedTracks();
  }, []);

  const loadSavedTracks = async () => {
    try {
      const response = await fetch(`${API_BASE}/spotify/tracks`);
      const data = await response.json();
      
      if (data.success) {
        setSavedTracks(data.tracks);
      }
    } catch (err) {
      console.error('Error loading tracks:', err);
    }
  };

  const getSpotifyStats = async () => {
    if (!url) {
      setError("Vui lòng nhập URL Spotify");
      return;
    }

    if (!url.includes('spotify.com')) {
      setError("URL Spotify không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");
    setStats(null);

    try {
      const response = await fetch(`${API_BASE}/spotify/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url })
      });

      const data = await response.json();

      if (data.success) {
        setStats(data);
      } else {
        setError(data.error || 'Có lỗi xảy ra khi lấy dữ liệu Spotify');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTrack = async () => {
    if (!stats) return;

    try {
      const response = await fetch(`${API_BASE}/spotify/save-track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ track: stats })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Đã lưu track thành công!');
        setUrl("");
        setStats(null);
        loadSavedTracks();
      } else {
        alert(data.error || 'Không thể lưu track');
        setError(data.error || 'Không thể lưu track');
      }
    } catch (err) {
      const errorMsg = 'Không thể kết nối đến server';
      alert(errorMsg);
      setError(errorMsg);
      console.error('Error:', err);
    }
  };

  const deleteTrack = async (trackId) => {
    if (!confirm('Bạn có chắc muốn xóa track này?')) return;

    try {
      const response = await fetch(`${API_BASE}/spotify/delete-track/${trackId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Đã xóa track thành công!');
        loadSavedTracks();
        if (selectedTrack && selectedTrack.track_id === trackId) {
          setSelectedTrack(null);
        }
      } else {
        alert(data.error || 'Không thể xóa track');
      }
    } catch (err) {
      alert('Không thể kết nối đến server');
      console.error('Error:', err);
    }
  };

  const refreshTrackStats = async (trackUrl, trackId) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE}/spotify/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trackUrl })
      });

      const data = await response.json();

      if (data.success) {
        // Cập nhật thông tin mới trong danh sách
        const updatedTracks = savedTracks.map(track => 
          track.track_id === trackId ? { ...track, ...data } : track
        );
        setSavedTracks(updatedTracks);
        
        // Nếu đang xem track này, cập nhật luôn
        if (selectedTrack && selectedTrack.track_id === trackId) {
          setSelectedTrack({ ...selectedTrack, ...data });
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

  const viewTrackDetails = (track) => {
    setSelectedTrack(track);
  };

  const backToList = () => {
    setSelectedTrack(null);
  };

  return (
    <section 
      className="min-h-screen text-white px-6 py-20"
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
          {/* Header */}
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4">
              Thống kê Spotify Track
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {selectedTrack ? (
              // Hiển thị details khi có track được chọn
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <SpotifyTrackDetails
                  selectedTrack={selectedTrack}
                  loading={loading}
                  refreshTrackStats={refreshTrackStats}
                  onBack={backToList}
                />
              </motion.div>
            ) : (
              // Hiển thị danh sách tracks khi không có track nào được chọn
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <SpotifyTrackList_user
                  savedTracks={savedTracks}
                  loading={loading}
                  viewTrackDetails={viewTrackDetails}
                  deleteTrack={deleteTrack}
                  refreshTrackStats={refreshTrackStats}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
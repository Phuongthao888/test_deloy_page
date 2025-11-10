"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Import components
import SpotifyHeader from './SpotifyHeader';
import SpotifyTabs from './SpotifyTabs';
import SpotifyAddTrack from './SpotifyAddTrack';
import SpotifyTrackList_admin from './SpotifyTrackList_admin';
import SpotifyTrackDetails from './SpotifyTrackDetails';
import SpotifyStreamInput from './SpotifyStreamInput';

// Sử dụng environment variable hoặc URL mặc định
const API_BASE = process.env.NEXT_PUBLIC_SPOTIFY_API_URL || 'https://realtime-statistics-spotify.onrender.com/api';

export default function SpotifyStats() {
  const [url, setUrl] = useState("");
  const [stats, setStats] = useState(null);
  const [savedTracks, setSavedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("add");
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
        setActiveTab("add");
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
        setActiveTab("list");
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

  const viewTrackDetails = async (track) => {
    setSelectedTrack(track);
    setActiveTab("details");
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
          {/* Header */}
          <SpotifyHeader 
            showStreamInput={showStreamInput}
            setShowStreamInput={setShowStreamInput}
          />

          {/* Tab Navigation */}
          <SpotifyTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedTrack={selectedTrack}
            savedTracksCount={savedTracks.length}
          />

          {/* Tab Content */}
          {activeTab === "add" && (
            <SpotifyAddTrack
              url={url}
              setUrl={setUrl}
              stats={stats}
              loading={loading}
              error={error}
              getSpotifyStats={getSpotifyStats}
              saveTrack={saveTrack}
            />
          )}
          
          {activeTab === "list" && (
            <SpotifyTrackList_admin
              savedTracks={savedTracks}
              loading={loading}
              viewTrackDetails={viewTrackDetails}
              deleteTrack={deleteTrack}
              refreshTrackStats={refreshTrackStats}
            />
          )}

          {activeTab === "details" && selectedTrack && (
            <SpotifyTrackDetails
              selectedTrack={selectedTrack}
              loading={loading}
              refreshTrackStats={refreshTrackStats}
              setActiveTab={setActiveTab}
            />
          )}
        </motion.div>
      </div>

      {/* Modal nhập số liệu streams */}
      {showStreamInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Nhập số liệu Spotify Streams</h3>
              <button
                onClick={() => setShowStreamInput(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <SpotifyStreamInput 
              tracks={savedTracks}
              onStreamDataSaved={() => {
                setShowStreamInput(false);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_SPOTIFY_API_URL || 'https://realtime-statistics-spotify.onrender.com/api';

export default function SpotifyStreamInput({ tracks, onStreamDataSaved }) {
  const [selectedTrack, setSelectedTrack] = useState("");
  const [streamData, setStreamData] = useState({
    date: "",
    total_streams: "",
    daily_streams: "",
    change: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recentStreams, setRecentStreams] = useState([]);
  const [yesterdayStreams, setYesterdayStreams] = useState(null);
  const [allStreams, setAllStreams] = useState([]);

  // Format ngày hiện tại thành dd/mm/yyyy
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    setStreamData(prev => ({ ...prev, date: formattedDate }));
  }, []);

  // Load all streams khi track thay đổi
  useEffect(() => {
    if (selectedTrack) {
      loadAllStreams();
    }
  }, [selectedTrack]);

  const loadAllStreams = async () => {
    try {
      const response = await fetch(`${API_BASE}/spotify/streams/${selectedTrack}`);
      const data = await response.json();
      
      if (data.success && data.streams.length > 0) {
        const streams = data.streams;
        setAllStreams(streams);
        setRecentStreams(streams.slice(-5));
      } else {
        setAllStreams([]);
        setRecentStreams([]);
      }
    } catch (err) {
      console.error('Error loading streams:', err);
      setAllStreams([]);
      setRecentStreams([]);
    }
  };

  // Tìm số liệu ngày hôm trước dựa trên ngày nhập vào
  const findYesterdayStreams = (currentDate) => {
    if (!currentDate || allStreams.length === 0) {
      setYesterdayStreams(null);
      return;
    }

    // Chuyển đổi ngày nhập vào thành Date object
    const [day, month, year] = currentDate.split('/').map(Number);
    const currentDateObj = new Date(year, month - 1, day);
    
    // Tính ngày hôm trước
    const yesterdayObj = new Date(currentDateObj);
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    
    const yesterdayFormatted = `${yesterdayObj.getDate().toString().padStart(2, '0')}/${(yesterdayObj.getMonth() + 1).toString().padStart(2, '0')}/${yesterdayObj.getFullYear()}`;

    // Tìm số liệu của ngày hôm trước trong database
    const yesterdayData = allStreams.find(stream => stream.date === yesterdayFormatted);
    
    if (yesterdayData) {
      setYesterdayStreams({
        date: yesterdayData.date,
        daily_streams: yesterdayData.daily_streams
      });
    } else {
      setYesterdayStreams(null);
    }
  };

  // Tự động tính toán "Tăng/Giảm" khi Daily streams hoặc ngày thay đổi
  useEffect(() => {
    if (streamData.daily_streams && streamData.date && yesterdayStreams) {
      const currentDaily = parseInt(streamData.daily_streams.replace(/\./g, ''));
      const yesterdayDaily = yesterdayStreams.daily_streams;
      
      if (!isNaN(currentDaily) && yesterdayDaily) {
        const changeValue = currentDaily - yesterdayDaily;
        setStreamData(prev => ({
          ...prev,
          change: formatNumber(changeValue.toString(), true)
        }));
      }
    }
  }, [streamData.daily_streams, streamData.date, yesterdayStreams]);

  // Khi ngày thay đổi, tìm số liệu ngày hôm trước
  useEffect(() => {
    if (streamData.date && allStreams.length > 0) {
      findYesterdayStreams(streamData.date);
    } else {
      setYesterdayStreams(null);
    }
  }, [streamData.date, allStreams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTrack) {
      setMessage("Vui lòng chọn track");
      return;
    }

    if (!streamData.date || !streamData.total_streams) {
      setMessage("Vui lòng nhập ngày và tổng streams");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        track_id: selectedTrack,
        date: streamData.date,
        total_streams: parseInt(streamData.total_streams.replace(/\./g, '')),
        daily_streams: streamData.daily_streams ? parseInt(streamData.daily_streams.replace(/\./g, '')) : null,
        change: streamData.change ? parseInt(streamData.change.replace(/\./g, '')) : null
      };

      const response = await fetch(`${API_BASE}/spotify/streams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Đã lưu số liệu stream thành công!");
        setStreamData(prev => ({ 
          ...prev, 
          daily_streams: "",
          change: ""
        }));
        
        // Load lại all streams
        loadAllStreams();
        
        // Gọi callback nếu có
        if (onStreamDataSaved) {
          onStreamDataSaved();
        }
      } else {
        setMessage(`${data.error}`);
      }
    } catch (err) {
      setMessage("Lỗi kết nối server");
      console.error('Error saving stream data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value, allowNegative = false) => {
    if (!value) return "";
    
    if (allowNegative) {
      const numericValue = value.toString().replace(/[^\d-]/g, '');
      
      let result = numericValue;
      if (numericValue.includes('-')) {
        result = '-' + numericValue.replace(/-/g, '');
      }
      
      if (result === "" || result === "-") return result;
      
      const parts = result.split('-');
      const absoluteValue = parts[parts.length - 1];
      const formattedAbsolute = absoluteValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      return parts.length > 1 ? `-${formattedAbsolute}` : formattedAbsolute;
    } else {
      const numericValue = value.toString().replace(/\D/g, '');
      if (numericValue === "") return "";
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  };

  const handleNumberChange = (field, value) => {
    const allowNegative = field === 'change';
    
    setStreamData(prev => ({
      ...prev,
      [field]: formatNumber(value, allowNegative)
    }));
  };

  const getSelectedTrackInfo = () => {
    return tracks.find(track => track.track_id === selectedTrack);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-center">Nhập số liệu Spotify Streams</h3>
      
      {/* Track Selection */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Chọn track *
        </label>
        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-black/5 border border-white/20 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">-- Chọn track --</option>
          {tracks.map(track => (
            <option key={track.track_id} value={track.track_id}>
              {track.title} - {track.artist}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Track Info */}
      {selectedTrack && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-white/5 rounded-xl"
        >
          <div className="flex items-center gap-4">
            <img
              src={getSelectedTrackInfo()?.thumbnail}
              alt={getSelectedTrackInfo()?.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-semibold text-lg">{getSelectedTrackInfo()?.title}</h4>
              <p className="text-gray-400">{getSelectedTrackInfo()?.artist}</p>
              <p className="text-gray-500 text-sm">{getSelectedTrackInfo()?.album}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Thông tin ngày hôm trước */}
      {yesterdayStreams && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl"
        >
          <p className="text-sm text-blue-300">
            Số liệu ngày {yesterdayStreams.date}: {yesterdayStreams.daily_streams?.toLocaleString()} streams
          </p>
          <p className="text-xs text-blue-400 mt-1">
            Hệ thống tự động tính "Tăng/Giảm" so với ngày {yesterdayStreams.date}
          </p>
        </motion.div>
      )}

      {streamData.date && !yesterdayStreams && allStreams.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
        >
          <p className="text-sm text-yellow-300">
            Không tìm thấy số liệu cho ngày hôm trước
          </p>
          <p className="text-xs text-yellow-400 mt-1">
            Bạn có thể nhập thủ công giá trị "Tăng/Giảm"
          </p>
        </motion.div>
      )}

      {/* Stream Data Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Ngày (dd/mm/yyyy) *
            </label>
            <input
              type="text"
              value={streamData.date}
              onChange={(e) => setStreamData(prev => ({ ...prev, date: e.target.value }))}
              placeholder="dd/mm/yyyy"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Tổng streams *
            </label>
            <input
              type="text"
              value={streamData.total_streams}
              onChange={(e) => handleNumberChange('total_streams', e.target.value)}
              placeholder="1.534.185"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Streams trong ngày
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={streamData.daily_streams}
                onChange={(e) => handleNumberChange('daily_streams', e.target.value)}
                placeholder="27.468"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Tăng/Giảm so với hôm trước
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={streamData.change}
                onChange={(e) => handleNumberChange('change', e.target.value)}
                placeholder="-5.581"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                readOnly={!!streamData.daily_streams && !!yesterdayStreams}
              />
              {streamData.daily_streams && yesterdayStreams && (
                <span className="text-xs text-green-400 self-center">Tự động tính</span>
              )}
            </div>
          </div>
        </div>

        {/* Recent Streams Preview */}
        {recentStreams.length > 0 && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <h4 className="font-semibold text-lg mb-3">5 số liệu gần nhất:</h4>
            <div className="space-y-2 text-sm">
              {recentStreams.map((stream, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">{stream.date}</span>
                  <div className="flex gap-4">
                    <span className="text-green-400">{stream.total_streams?.toLocaleString()}</span>
                    {stream.daily_streams && (
                      <span className="text-blue-400">+{stream.daily_streams.toLocaleString()}</span>
                    )}
                    {stream.change && (
                      <span className={stream.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {stream.change >= 0 ? '+' : ''}{stream.change.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 rounded-xl text-center ${
              message.includes('') 
                ? 'bg-green-500/20 border border-green-500 text-green-200' 
                : 'bg-red-500/20 border border-red-500 text-red-200'
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedTrack}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Đang lưu...' : 'Lưu số liệu'}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-4 text-sm text-gray-400 text-center">
        <p>Định dạng số: sử dụng dấu chấm phân cách hàng nghìn (1.534.185)</p>
        <p>Chỉ bắt buộc nhập Ngày và Tổng streams</p>
        <p className="text-green-400">Hệ thống tự động tính "Tăng/Giảm" dựa trên ngày bạn nhập</p>
      </div>
    </div>
  );
}
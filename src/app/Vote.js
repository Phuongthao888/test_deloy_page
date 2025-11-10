"use client";
import { useState } from "react";

const votes = [
  {
    id: 1,
    title: "L'Oreal Awards 2025",
    period: "24/09 - 15/10",
    guideLink: "/vote/loreal-2025",
    embedUrl: "https://official-vote-site.com/embed",
    status: "ongoing",
    description:
      "Giải thưởng danh giá nhằm vinh danh những cá nhân, tập thể xuất sắc trong lĩnh vực sáng tạo và đổi mới.",
    stats: { totalVotes: 125430, myVotes: 320 },
  },
  {
    id: 2,
    title: "Asia Music Awards",
    period: "20/11 - 01/12",
    guideLink: "/vote/ama-2025",
    embedUrl: "https://ama-vote.com/embed",
    status: "upcoming",
    description:
      "Sân khấu âm nhạc lớn nhất châu Á với sự góp mặt của hàng trăm nghệ sĩ nổi tiếng.",
    stats: { totalVotes: 0, myVotes: 0 },
  },
];

export default function VoteAwards() {
  const [selected, setSelected] = useState(votes[0]);

  return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Tiêu đề */}
      <h2 className="text-4xl md:text-5xl font-serif text-center text-gray-900 mb-16 relative z-10">
        Vote & Giải thưởng
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 -z-10"></span>
      </h2>

      {/* Danh sách vote */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
        {votes.map((vote) => (
          <div
            key={vote.id}
            onClick={() => setSelected(vote)}
            className={`relative p-6 rounded-3xl shadow-xl cursor-pointer border transition-all transform hover:-translate-y-3 hover:shadow-2xl
              ${
                selected.id === vote.id
                  ? "bg-gradient-to-tr from-blue-50 to-purple-50 border-blue-300 shadow-blue-200"
                  : "bg-white border-gray-200 hover:bg-white/80"
              }`}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              {vote.title}
            </h3>
            <p className="text-sm md:text-base text-gray-500 mb-3">
              ⏰ {vote.period}
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium
                ${
                  vote.status === "ongoing"
                    ? "bg-green-100 text-green-700"
                    : vote.status === "upcoming"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {vote.status === "ongoing"
                ? "Đang diễn ra"
                : vote.status === "upcoming"
                ? "Sắp mở"
                : "Đã kết thúc"}
            </span>
          </div>
        ))}
      </div>

      {/* Chi tiết vote */}
      {selected && (
        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12 max-w-4xl mx-auto transition-all duration-300 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            {selected.title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {selected.description}
          </p>

          {/* Số liệu */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {selected.stats?.totalVotes?.toLocaleString?.() ?? "0"}
              </p>
              <p className="text-gray-500 text-sm">Tổng lượt vote</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {selected.stats?.myVotes?.toLocaleString?.() ?? "0"}
              </p>
              <p className="text-gray-500 text-sm">Lượt vote của bạn</p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <a
              href={selected.guideLink}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 shadow-lg"
            >
              Xem hướng dẫn
            </a>
            <a
              href={selected.embedUrl}
              target="_blank"
              className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 shadow-lg"
            >
              Đi đến trang vote
            </a>
          </div>

          {/* Iframe */}
          <div className="w-full h-[500px] md:h-[600px] border rounded-xl overflow-hidden shadow-inner">
            <iframe
              src={selected.embedUrl}
              className="w-full h-full"
              frameBorder="0"
              title="Vote Embed"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}

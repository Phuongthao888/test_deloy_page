export default function Hero() {
    return (  
    <section
        className="h-screen flex flex-col justify-center items-center px-6 md:px-12 relative"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-8xl text-center z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Chào mừng đến với WINGS for LYHAN
          </h1>
          <p className="text-base md:text-2xl mb-8 text-gray-200 leading-relaxed">
            Những đôi cánh mang ước mơ âm nhạc của LYHAN - Thảo Linh, bay cao và xa hơn cùng WINGS for LYHAN
          </p>
          <a
            href="#introduction"
            className="inline-block bg-white text-black px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-200 transition"
          >
            Tìm hiểu thêm
          </a>
        </div>
      </section> );
}
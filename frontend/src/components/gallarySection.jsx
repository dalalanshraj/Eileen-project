import { useEffect, useState } from "react";
import api from "../api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://donnadaniel.mysawgrasspointe.com/";

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };

  // ===========================
  // FETCH GALLERY IMAGES
  // ===========================
  useEffect(() => {
    api
      .get("/gallery/published")
      .then((res) => {
        const data = res.data || [];

        const formatted = data.map((img) => getImageUrl(img.image));

        console.log("IMAGES:", formatted);

        setImages(formatted);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  // ===========================
  // AUTO SLIDE
  // ===========================
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  // NAVIGATION
  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  // ===========================
  // UI STATES
  // ===========================
  if (loading) {
    return <p className="text-center py-20">Loading gallery...</p>;
  }

  if (!images.length) {
    return <p className="text-center py-20">No images found</p>;
  }

  return (
    <section className="w-full py-12 px-6 md:px-16">
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-sky-900 text-center leading-tight mb-5">
        Property Gallery
      </h2>

      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] overflow-hidden rounded-2xl">
        {/* SLIDES */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {images.map((img, i) => (
            <img
              src={img}
              alt="gallery"
              className="w-full flex-shrink-0 object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          ))}
        </div>

        {/* LEFT */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          <ChevronLeft />
        </button>

        {/* RIGHT */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          <ChevronRight />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                current === i ? "bg-white" : "bg-white/50"
              }`}
            ></div>
          ))}
        </div>
       
      </div>
       <Link to={"/gallery"}>
        <div className="flex justify-center mt-14">
    <button
      onClick={() => setOpen(true)}
      className="px-8 py-3 rounded-full  text-black font-medium shadow-md bg-[#F8F812]  hover:bg-[#1B252F] hover:text-white hover:scale-105  transition duration-300"
    >
      View More  →
    </button>
  </div>
        
        </Link>
    </section>
  );
}

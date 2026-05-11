import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import ReviewModal from "../components/homeSection/ReviewModal";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  // ==============================
  // FETCH REVIEWS (BACKEND PAGINATION)
  // ==============================
  const fetchReviews = async (page = 1) => {
    try {
      const res = await api.get(`/listings/reviews?page=${page}`);

      setReviews(res.data.reviews || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, []);

  // ==============================
  // FETCH HERO IMAGES
  // ==============================
  useEffect(() => {
    api
      .get("/gallery/published")
      .then((res) => {
        const data = res.data || [];
        const formatted = data.map((img) => getImageUrl(img.image));
        setImages(formatted);
      })
      .catch(console.log);
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const base = import.meta.env.VITE_API_URL || "";
    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };

  const image1 =
    images[0] ||
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511";

  // ==============================
  // UI
  // ==============================
  return (
    <>
      {/* HERO */}
      <section className="relative h-[30vh] md:h-[50vh] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${image1})` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <h1 className="relative text-3xl md:text-6xl font-bold">
          Reviews
        </h1>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

          {/* PAGINATION */}
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  onClick={() => {
                    setCurrentPage(num);
                    fetchReviews(num);
                  }}
                  className={`px-3 py-1 rounded border ${
                    currentPage === num
                      ? "bg-yellow-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {num}
                </button>
              )
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-white px-6 py-2 rounded shadow w-full md:w-auto"
          >
            WRITE REVIEW
          </button>
        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-6">
          {reviews.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row gap-4">

                {/* IMAGE */}
                <img
                  src={getImageUrl(item.property.image)}
                  className="w-full md:w-40 h-48 md:h-28 object-cover rounded-lg"
                  alt=""
                />

                {/* CONTENT */}
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {item.property?.title || "Property"}
                  </h2>

                  <p className="text-gray-600 mt-1 text-sm md:text-base line-clamp-2">
                    {item.review}
                  </p>

                  <p className="text-blue-500 text-sm mt-2">
                    {item.user} •{" "}
                    {item.stayDate
                      ? new Date(item.stayDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex md:flex-col justify-between md:items-end items-center gap-3 md:text-right">
                  <div>
                    <p className="text-lg md:text-xl font-bold">
                      {item.rating}.0 / 5
                    </p>

                    <div className="text-yellow-400 text-sm md:text-lg">
                      {"★".repeat(item.rating || 5)}
                    </div>
                  </div>

                  <Link
                    to={`/listing/${item.listingId}`}
                    className="bg-green-500 text-white px-4 py-2 rounded text-sm md:text-base whitespace-nowrap"
                  >
                    READ REVIEWS
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <ReviewModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
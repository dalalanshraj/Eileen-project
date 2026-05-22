import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ReviewModal from "../components/homeSection/ReviewModal";

export default function Reviews() {

  const [reviews, setReviews] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [images, setImages] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [properties, setProperties] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState("all");

  // ==============================
  // FETCH REVIEWS
  // ==============================
  const fetchReviews = async (
    page = 1,
    property = selectedProperty,
  ) => {

    try {

      let url = `/listings/reviews?page=${page}`;

      if (property !== "all") {

        url += `&property=${encodeURIComponent(property)}`;
      }

      const res = await api.get(url);

      setReviews(res.data.reviews || []);

      setTotalPages(res.data.pages || 1);

    } catch (err) {

      console.error(err);

      setReviews([]);
    }
  };

  // ==============================
  // LOAD REVIEWS
  // ==============================
  useEffect(() => {

    fetchReviews(currentPage, selectedProperty);

  }, [currentPage, selectedProperty]);

  // ==============================
  // FETCH PROPERTIES
  // ==============================
  useEffect(() => {

    fetchProperties();

  }, []);

  const fetchProperties = async () => {

    try {

      const res = await api.get("/listings/published");

      setProperties(res.data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // ==============================
  // IMAGE URL
  // ==============================
const getImageUrl = (photo) => {
  const base =
    import.meta.env.VITE_API_URL || "";

  // new object format
  if (photo?.url) {
    if (photo.url.startsWith("http")) {
      return photo.url;
    }

    return (
      base.replace(/\/$/, "") +
      "/" +
      photo.url.replace(/^\//, "")
    );
  }

  // old string fallback
  if (typeof photo === "string") {
    if (photo.startsWith("http")) {
      return photo;
    }

    return (
      base.replace(/\/$/, "") +
      "/" +
      photo.replace(/^\//, "")
    );
  }

  return "/placeholder.png";
};

  const heroImage =
    images[0] ||
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511";

  return (
    <>
      {/* HERO */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white">

        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <h1 className="relative text-3xl md:text-6xl font-bold mt-15">
          Reviews
        </h1>

      </section>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

          {/* LEFT */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* PAGINATION */}
            <div className="flex gap-2 flex-wrap">

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1,
              ).map((num) => (

                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-4 py-2 rounded border transition ${
                    currentPage === num
                      ? "bg-yellow-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* PROPERTY FILTER */}
            <select
              value={selectedProperty}
              onChange={(e) => {

                setSelectedProperty(e.target.value);

                setCurrentPage(1);
              }}
              className="border px-4 py-2 rounded-lg bg-white min-w-[250px]"
            >

              <option value="all">
                All Properties
              </option>

              {properties.map((item) => (

             <option
  key={item._id}
  value={item.property?.title || item.title}
>
  {item.property?.title || item.title}
</option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded shadow w-full md:w-auto transition"
          >
            WRITE REVIEW
          </button>
        </div>

        {/* REVIEWS */}
        <div className="space-y-6 overflow-auto">

          {reviews.length > 0 ? (
            reviews.map((item) => (

              <div
                key={item._id}
                className="bg-white rounded-2xl shadow p-4 md:p-5 hover:shadow-xl transition"
              >

                <div className="flex flex-col md:flex-row gap-5">

                  {/* IMAGE */}
                  <img
                    src={getImageUrl(item.property?.image)}
                    className="w-full md:w-44 h-56 md:h-32 object-cover rounded-xl"
                    alt=""
                  />

                  {/* CONTENT */}
                  <div className="flex-1">

                   <h2 className="text-xl font-semibold text-gray-800">
  {item.property?.title || "Property"}
</h2>

                    <p className="text-gray-600 mt-2 text-sm md:text-base leading-relaxed">
                      {item.review}
                    </p>

                    <p className="text-blue-500 text-sm mt-3">

                      {item.user} •{" "}

                      {item.stayDate
                        ? new Date(
                            item.stayDate,
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex md:flex-col justify-between items-center md:items-end gap-3">

                    <div className="text-center md:text-right">

                      <p className="text-xl font-bold">
                        {item.rating}.0 / 5
                      </p>

                      <div className="text-yellow-400 text-lg">

                        {"★".repeat(item.rating || 5)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (

            <div className="text-center py-20 text-gray-500 text-lg">
              No Reviews Found
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <ReviewModal
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
// import heroImg from "../assets/image/property.jpg";

export default function AboutSection({ listingId }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    // already full URL
    if (path.startsWith("http")) return path;

    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };

  // ===========================
  // FETCH LISTING
  // ===========================
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        setListing(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  // ===========================
  // LOADING UI
  // ===========================
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading property...</div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center text-red-500">Property not found</div>
    );
  }

  const image =
    listing?.photos?.length > 0
      ? getImageUrl(listing.photos[0])
      : "https://via.placeholder.com/600x400";

  return (
    <section className="bg-[#4aa3c7] py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <p className="text-yellow-300 text-sm sm:text-base mb-2">
            Welcome to
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            DONNA DANIEL <br /> REALTY INC
          </h1>

          <p className="mt-4 sm:mt-6 text-white/90 text-sm sm:text-base leading-relaxed">
            Donna Daniel Realty Inc is your trusted partner in finding the
            perfect home and investment opportunities. We specialize in premium
            properties, offering expert guidance for buying, selling, and
            renting real estate.
          </p>

          <p className="mt-4 text-white/90 text-sm sm:text-base leading-relaxed">
            From luxury homes to modern apartments, our team ensures a smooth
            and transparent process. We focus on delivering value, comfort, and
            long-term satisfaction to every client.
          </p>

          <p className="mt-4 text-white/90 text-sm sm:text-base leading-relaxed">
            Whether you're searching for your dream home or a profitable
            investment, we are here to guide you every step of the way.
          </p>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <img
            src={image}
            alt="Real Estate"
            className="w-full h-[250px] sm:h-[350px] border-5 border-white md:h-[450px] object-cover rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}

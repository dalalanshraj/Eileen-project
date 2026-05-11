import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";

export default function CommunityDetails() {
  const { slug } = useParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, [slug]);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/listings/published");

  const filtered = res.data.filter((item) => {

  const title =
    item.property?.title?.toLowerCase().trim() || "";

  // CRYSTAL SANDS
  if (slug === "crystal-sands") {
    return (
      title.includes("crystal") &&
      title.includes("sand")
    );
  }

  // MEDITERRANEA
  if (slug === "mediterranea") {
    return title.includes("med");
  }

  return false;
});

      setProperties(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";
    const base = import.meta.env.VITE_API_URL || "";
    if (path.startsWith("http")) return path;
    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };

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

  const image1 =
    images[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511";

  const image2 =
    images[1] || "https://images.unsplash.com/photo-1560185007-cde436f6a4d0";

  const image3 = images[4];
  const heroImage = images[2] || image1;

  return (
    <>
      {/* HERO */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <h1 className="relative text-5xl md:text-6xl font-extrabold capitalize text-center px-4">
          {slug.replace(/-/g, " ")}
        </h1>
      </section>

      {/* CONTENT */}
      <div className="bg-gray-100 min-h-screen py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADING */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#355e73]">
              Available Properties
            </h2>

            <p className="text-gray-500 mt-2">
              Explore vacation rentals in {slug.replace(/-/g, " ")}
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center text-lg">Loading properties...</div>
          )}

          {/* EMPTY */}
          {!loading && properties.length === 0 && (
            <div className="text-center text-red-500 text-lg">
              No properties found
            </div>
          )}

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((listing) => (
              <PropertyCard key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

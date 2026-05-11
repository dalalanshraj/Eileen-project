import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard";

const Properties = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
   const [images, setImages] = useState([]);
  
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
  
      const image3 =
      images[4] ;
  
  
    const heroImage = images[2] || image1;

  useEffect(() => {
    api
      .get("/listings/published")
      .then((res) => {
        setListings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
            backgroundImage: `url(${heroImage})`,
          }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-6xl font-extrabold">
          Properties
        </h1>
      </section>

      {/* LISTINGS */}
      <div className="p-10 bg-gray-100 min-h-screen">
         <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-sky-900 text-center leading-tight mb-5">
    Available Vacation Rentals
  </h2>

        {loading && (
          <p className="text-center text-gray-500">
            Loading properties...
          </p>
        )}

        {!loading && listings.length === 0 && (
          <p className="text-center text-red-500">
            No properties available
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {listings.map((listing) => (
            <PropertyCard
              key={listing._id}
              listing={listing}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Properties;

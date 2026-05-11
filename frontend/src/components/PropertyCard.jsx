import React from "react";
import { Link, Links } from "react-router-dom";

const PropertyCard = ({ listing }) => {
  if (!listing) return null;

const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };
  // IMAGE
  const image =
    listing?.photos?.length > 0
      ? getImageUrl(listing.photos[0]) // ✅ index 0 use karo
      : "https://via.placeholder.com/400x300?text=No+Image";

  // PRICE
  const originalPrice = listing?.rates?.[0]?.nightly || null;

  const dealPrice = listing?.deal?.discountedRate;

  const price = dealPrice || originalPrice || "Call for price";

  return (
    <Link to={`/${listing?._id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative">
        {/* DEAL RIBBON */}
        {listing?.deal && (
          <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs px-6 py-1 -rotate-45 -translate-x-8 translate-y-4">
            DEAL
          </div>
        )}

        {/* IMAGE */}
        <img
          src={image}
          alt={listing?.property?.title || "Property"}
          className="w-full h-56 object-cover"
        />

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="text-xl  mb-1">
            {listing?.property?.title ?? "Property"}
          </h3>

          <p className="text-gray-600 text-sm mb-2">
            {listing?.property?.category ?? "Vacation Rental"}
          </p>

          <div className="text-lg font-semibold">
            {listing?.deal ? (
              <>
                <span className="text-red-500 font-bold">
                  ${listing.deal.discountedRate}
                </span>

                <span className="line-through text-gray-400 ml-2 text-sm">
                  ${originalPrice}
                </span>
              </>
            ) : (
              <span className="text-[#44AAD8] font-medium">
                {typeof originalPrice === "number"
                  ? `$${originalPrice} / Night`
                  : "Call for price"}
              </span>
            )}
          </div>

          <Link
            to={`/${listing?._id}`}
            className="inline-block mt-3 text-black font-semibold  p-2 rounded-2xl bg-[#F8F812] hover:bg-[#1B252F] hover:text-white transition "
          >
            View Details →
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

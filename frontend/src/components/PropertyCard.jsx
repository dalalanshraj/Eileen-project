import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ listing }) => {
  if (!listing) return null;

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return (
      base.replace(/\/$/, "") + "/" + path.replace(/^\//, "")
    );
  };

  // IMAGE
  const image =
    listing?.photos?.length > 0
      ? getImageUrl(listing.photos[0])
      : "https://via.placeholder.com/400x300?text=No+Image";

  // PRICE
  const originalPrice = listing?.rates?.[0]?.nightly || null;
  const dealPrice = listing?.deal?.discountedRate;

  return (
    <Link to={`/${listing?._id}`} className="block h-full">
      <div
        className="
          bg-white
          rounded-2xl
          shadow-md
          hover:shadow-2xl
          transition-all
          duration-300
          overflow-hidden
          relative
          h-full
          flex
          flex-col
          group
        "
      >
        {/* DEAL RIBBON */}
        {listing?.deal && (
          <div
            className="
              absolute
              top-3
              left-[-35px]
              bg-orange-500
              text-white
              text-[10px]
              sm:text-xs
              font-semibold
              px-10
              py-1
              rotate-[-45deg]
              z-20
              shadow-md
            "
          >
            DEAL
          </div>
        )}

        {/* IMAGE */}
        <div className="overflow-hidden">
          <img
            src={
  listing.photos?.[0]?.url
    ? `${
        import.meta.env.VITE_API_URL
      }/${listing.photos[0].url.replace(
        /^\//,
        ""
      )}`
    : "/placeholder.png"
}
            alt={listing?.property?.title || "Property"}
            className="
              w-full
              h-52
              sm:h-56
              md:h-60
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* CONTENT */}
        <div
          className="
            p-4
            sm:p-5
            flex
            flex-col
            flex-grow
          "
        >
          {/* TITLE */}
          <h3
            className="
              text-lg
              sm:text-xl
              font-semibold
              leading-snug
              mb-2
              line-clamp-2
            "
          >
            {listing?.property?.title ?? "Property"}
          </h3>

          {/* CATEGORY */}
          <p
            className="
              text-gray-600
              text-sm
              sm:text-base
              mb-3
            "
          >
            {listing?.property?.category ?? "Vacation Rental"}
          </p>

          {/* PRICE */}
          <div className="mb-4">
            {listing?.deal ? (
              <div className="flex items-center flex-wrap gap-2">
                <span
                  className="
                    text-red-500
                    font-bold
                    text-lg
                    sm:text-xl
                  "
                >
                  ${listing.deal.discountedRate}
                </span>

                <span
                  className="
                    line-through
                    text-gray-400
                    text-sm
                  "
                >
                  ${originalPrice}
                </span>
              </div>
            ) : (
              <span
                className="
                  text-[#44AAD8]
                  font-semibold
                  text-base
                  sm:text-lg
                "
              >
                {typeof originalPrice === "number"
                  ? `$${originalPrice} / Night`
                  : "Call for price"}
              </span>
            )}
          </div>

          {/* BUTTON */}
          <div className="mt-auto">
            <span
              className="
                inline-flex
                items-center
                justify-center
                w-full
                sm:w-auto
                px-5
                py-3
                rounded-xl
                bg-[#F8F812]
                text-black
                font-semibold
                text-sm
                sm:text-base
                transition-all
                duration-300
                hover:bg-[#1B252F]
                hover:text-white
              "
            >
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
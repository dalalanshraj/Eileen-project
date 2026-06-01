import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoLocation } from "react-icons/io5";

export default function AboutSection({ listingId }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return "https://via.placeholder.com/600x400";
};

  // FETCH LISTING
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

  // LOADING
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading property...
      </div>
    );
  }

  // NO PROPERTY
  if (!listing) {
    return (
      <div className="py-20 text-center text-red-500">
        Property not found
      </div>
    );
  }

  const image =
  listing?.photos?.length > 0
    ? getImageUrl(listing.photos[0])
    : "https://via.placeholder.com/600x400";

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#4aa3c7]
        py-16
        sm:py-20
        md:py-24
        lg:py-28
        px-4
        sm:px-6
        lg:px-8
      "
    >
      {/* BACKGROUND DESIGN */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-12
          lg:gap-20
          items-center
        "
      >
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <p
            className="
              text-yellow-300
              text-sm
              sm:text-base
              font-medium
              tracking-wide
              uppercase
              mb-3
            "
          >
            Welcome to
          </p>

          <h1
  className="
    text-3xl
    sm:text-4xl
    md:text-5xl
    lg:text-6xl
    font-extrabold
    text-white
    leading-tight
  "
>
  Shawn & Eileen <br className="hidden sm:block" />
  O'Sullivan
</h1>

<p className="text-white">
  Owners of Beach Therapy 30A
</p>
          {/* <p className="text-white">A Licensed Real Estate Broker in Florida</p> */}
          <div className="mt-5 space-y-3">
  {/* PHONE */}
  {/* <div className="flex items-center justify-center lg:justify-start gap-3">
    <div className="bg-[#4aa3c7] p-2 rounded-full">
      <FaPhoneAlt className="text-white text-sm" />
    </div>

    <a
      href="tel:+1234567890"
      className="text-white text-sm sm:text-base hover:text-yellow-300 transition"
    >
      +1 (404) 275-6533 
    </a>
  </div> */}

  {/* EMAIL */}
  {/* <div className="flex items-center justify-center lg:justify-start gap-3">
    <div className="bg-[#4aa3c7] p-2 rounded-full">
      <MdEmail className="text-white text-sm" />
    </div>

    <a
      href="mailto:info@donnadanielrealty.com"
      className="text-white text-sm sm:text-base hover:text-yellow-300 transition"
    >
      donna.daniel@mindspring.com
    </a>
  </div> */}

  {/* ADDRESS */}
  {/* <div className="flex items-start justify-center lg:justify-start gap-3">
    <div className="bg-[#4aa3c7] p-2 rounded-full mt-1">
      <IoLocation className="text-white text-sm" />
    </div>

    <p className="text-white text-sm sm:text-base leading-relaxed">
      4321 Carriage Ln
Destin, FL 32541,
    </p>
  </div> */}
</div>

         <div className="space-y-4 sm:space-y-5 mt-5 sm:mt-6">
  <p
    className="
      text-white/90
      text-sm
      sm:text-base
      md:text-lg
      leading-relaxed
    "
  >
    Welcome! We are Shawn and Eileen O’Sullivan and we are the owners of
    Beach Therapy 30A, located in Grayton Beach, FL. Originally, we are
    from Long Island, NY where we spent the beginning of our lives.
  </p>

  <p
    className="
      text-white/90
      text-sm
      sm:text-base
      md:text-lg
      leading-relaxed
    "
  >
    We are high school sweethearts. Shawn went on to become a police
    officer and paramedic for almost 30 years, while Eileen worked as an
    emergency room nurse before becoming a stay-at-home mother. We also
    have two amazing children, Kelly and Christopher. Kelly is a doctor
    and Christopher is a math teacher. Our daughter is married to Joe,
    and we have two grandchildren with a third on the way.
  </p>

  <p
    className="
      text-white/90
      text-sm
      sm:text-base
      md:text-lg
      leading-relaxed
    "
  >
    We spent many years deciding where to build our retirement home, and
    we truly found a gem in the 30A community. Some of Eileen’s favorite
    hobbies include going to the beach and relaxing in the sun. Beach
    Therapy 30A is within walking distance of the beach!
  </p>

  
 
</div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <div
            className="
              relative
              w-full
              max-w-2xl
            "
          >
            {/* IMAGE */}
            <img
              src={image}
              alt="Real Estate"
              className="
                w-full
                h-[260px]
                sm:h-[360px]
                md:h-[450px]
                lg:h-[520px]
                object-cover
                rounded-3xl
                border-4
                border-white
                shadow-2xl
              "
            />

            {/* FLOATING CARD */}
            {/* <div
              className="
                absolute
                -bottom-5
                left-1/2
                -translate-x-1/2
                sm:left-auto
                sm:right-6
                sm:translate-x-0
                bg-white
                rounded-2xl
                px-5
                py-4
                shadow-xl
                w-[85%]
                sm:w-auto
              "
            >
              <h3 className="text-lg font-bold text-[#4aa3c7]">
                Trusted Realty Experts
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Helping families find perfect vacation homes &
                investments.
              </p>
            </div> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
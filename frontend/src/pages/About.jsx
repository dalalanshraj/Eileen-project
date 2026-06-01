import { useEffect, useState } from "react";
import api from "../api/axios";
import AboutSection from "../components/homeSection/AboutSection";
import FeaturedActivities from "../components/homeSection/FeaturedActivities";

export default function About() {
  const [images, setImages] = useState([]);
  const [galleryImages, setGalleryImages] =
  useState([]);

  const getImageUrl = (path) => {
  if (!path) {
    return "/placeholder.png";
  }

  const base =
    import.meta.env.VITE_API_URL || "";

  if (path.startsWith("http")) {
    return path;
  }

  return (
    base.replace(/\/$/, "") +
    "/" +
    path.replace(/^\//, "")
  );
};

 useEffect(() => {
  api
    .get("/gallery/published")
    .then((res) => {
      setGalleryImages(res.data || []);
    })
    .catch(console.log)
    .finally(() => setLoading(false));
}, []);

  const image =
  galleryImages?.[0]?.image
    ? getImageUrl(
        galleryImages[0].image
      )
    : "https://via.placeholder.com/600x400";


  
  const heroImage =
  images[0] ||
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511";

const aboutSectionImage =
  images[1] ||
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0";

const bannerImage =
  images[2] ||
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511";

const whyChooseUsImage =
  images[3] ||
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0";
  return (
    <>
      {/* 🔥 HERO (FIXED IMAGE) */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white">

        {/* FIXED BACKGROUND */}
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mt-15">
  About Beach Therapy 30A
</h1>

<p className="text-gray-200 text-sm sm:text-base max-w-3xl mx-auto">
  Meet Shawn and Eileen O'Sullivan, the proud owners of Beach Therapy 30A in beautiful Grayton Beach, Florida. We are excited to share our slice of paradise with guests from around the world.
</p>
        </div>
      </section>

      {/* 🔥 ABOUT SECTION */}
     <AboutSection listingId="6a1606de8ee2fa44c5186e4b" />

       <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white">

        {/* FIXED BACKGROUND */}
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />

        {/* <div className="absolute inset-0 bg-black/60" /> */}

        <div className="relative text-center px-4 sm:px-6">
        </div>
      </section>
      {/* 🔥 WHY CHOOSE US */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* CONTENT */}
          <div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black leading-tight">
  Experience the Best of 30A
</h3>

<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
  Beach Therapy 30A offers the perfect combination of comfort, relaxation,
  and convenience. As onsite owners, we take pride in providing a welcoming
  and memorable experience for every guest who visits Grayton Beach.
</p>

<ul className="mt-6 space-y-3 text-gray-700 text-sm sm:text-base">
  <li>✔ Walking distance to the beautiful beach</li>
  <li>✔ Located in the heart of Grayton Beach, Florida</li>
  <li>✔ Direct communication with onsite owners</li>
  <li>✔ Close to biking trails, dining, and local attractions</li>
  <li>✔ Clean, comfortable, and family-friendly accommodations</li>
  <li>✔ Registered with the DBPR</li>
</ul>
          </div>

          {/* IMAGE */}
          <div className="overflow-hidden rounded-2xl group">
            <img
              src={image}
              className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover transition duration-700 group-hover:scale-110"
              alt="Why Choose Us"
            />
          </div>

        </div>
      </section>
      <FeaturedActivities />
    </>
  );
}
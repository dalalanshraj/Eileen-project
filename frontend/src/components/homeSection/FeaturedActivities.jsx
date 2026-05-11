import React from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import img1 from "../../assets/activity-img.jpg"
import img2 from "../../assets/activity-img2.jpg"
import img3 from "../../assets/activity-img3.jpg"

const activities = [
  {
    id: "party-boats",
    title: "Party Boats",
    category: "$$, Activities",
    description:
      "Looking for fun on the water? Party boats are one of the best ways to enjoy Destin with friends and family. Cruise along the beautiful emerald coast, play music, relax, and celebrate special moments while soaking in stunning ocean views. It’s the perfect mix of entertainment, relaxation, and unforgettable memories",
    image:
      img1,
  },
  {
  id: "golf-cart-rental",
  title: "Golf Cart Rental",
  category: "$$, Activities",
  description:
    "Explore Destin in a fun and convenient way with golf cart rentals. Perfect for short trips to the beach, local shops, and nearby attractions, golf carts offer a relaxed and easy way to get around while enjoying the coastal breeze with your family and friends.",
  image:
      img2,
  },
  {
    id: "boat-rentals",
    title: "Boat Rentals",
    category: "$$, Excursions",
    description:
      "There are so many places on the Harbor to rent boats and visit Crab Island and many other local spots. The boating rental options are plentiful in Destin!",
    image:
      "https://www.coastaldreamrentals.com/img/Featured-img/Featured-img2.jpg",
  },
];

const FeaturedActivities = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-sky-900 text-center leading-tight">
          Featured Activities
        </h2>
      </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10">

  {activities.map((item, index) => (
    <div
      key={index}
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      
      {/* IMAGE */}
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-[260px] object-cover group-hover:scale-110 transition duration-500"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {/* CONTENT */}
      <div className="absolute bottom-0 p-5 text-white">
        
        <h3 className="text-xl font-semibold mb-1">
          {item.title}
        </h3>

        <p className="text-sm opacity-80 mb-2">
          {item.category}
        </p>

        <p className="text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* BUTTON */}
        {/* <Link to={`/activity/${item.id}`}>
          <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 
          px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition">
            <IoSearch /> View
          </button>
        </Link> */}

      </div>
    </div>
  ))}

</div>
    </section>
  );
};

export default FeaturedActivities;

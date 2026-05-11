import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import FeaturedActivities from "../components/homeSection/FeaturedActivities";
import DiscoverDestinSection from "../components/homeSection/DiscoverDestin";
import DatePicker from "react-datepicker";
import PropertyCard from "../components/PropertyCard";
import AboutSection from "../components/homeSection/AboutSection.jsx";
import heroVideo from "../assets/video.mp4"
import GallerySection from "../components/gallarySection.jsx";

const HeroSection = ({listingId}) => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  

  const handleSearch = (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      setError("Please select both dates");
      setShowModal(true);
      return;
    }

    const params = new URLSearchParams({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    }).toString();

    navigate(`/results?${params}`);
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  useEffect(() => {
    api.get("/listings/published")
      .then((res) => {
        setListings(res.data.listings || res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center justify-center text-center overflow-hidden">
        
        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src={heroVideo}
            type="video/mp4"
          />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/9"></div>

        {/* CONTENT */}
        <div className="relative z-10 text-white px-4 w-full max-w-6xl">
          
          {/* HEADING */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold mb-4 leading-tight">
            Destin, FL Vacation Rental
            </h1>

          <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-10">
            Rental Property Management and Vacation Rentals in Okaloosa and Walton County
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSearch}
            className="bg-white text-black rounded-xl shadow-xl p-4 md:p-5  w-[95%] max-w-3xl mx-auto
            flex flex-col md:flex-row gap-3 md:gap-10 items-stretch md:items-center"
          >
            
            {/* CHECK IN */}
            <DatePicker
              selected={formData.checkIn ? new Date(formData.checkIn) : null}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  checkIn: formatDate(date),
                }))
              }
              placeholderText="Check In"
              className="w-full border rounded-lg px-3 py-2"
              minDate={new Date()}
            />

            {/* CHECK OUT */}
            <DatePicker
              selected={formData.checkOut ? new Date(formData.checkOut) : null}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  checkOut: formatDate(date),
                }))
              }
              placeholderText="Check Out"
              className="w-full border rounded-lg px-3 py-2"
              minDate={
                formData.checkIn
                  ? new Date(formData.checkIn)
                  : new Date()
              }
            />

            {/* GUESTS */}
            <select
              name="guests"
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: e.target.value })
              }
              className="w-full md:w-[150px] border rounded-lg px-3 py-2"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Guest{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-[#F8F812] text-black shadow-sm px-6 py-2 rounded-lg 
              hover:bg-[#1B252F] hover:text-white transition w-full md:w-auto"
            >
              Search
            </button>
          </form>
        </div>
      </section>
      <div className="py-16 bg-white">

  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-sky-900 text-center leading-tight">
    Available Vacation Rentals
  </h2>

  <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
    Experience the serene allure of the coast while enjoying the comfort and luxury our homes provide.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10">
    {(listings || []).slice(0, 4).map((listing) => (
      <PropertyCard key={listing._id} listing={listing} />
    ))}
  </div>
</div>


      <FeaturedActivities />
      <AboutSection listingId="69fa0b19d8b673e7d4bf1637" />
      {/* <DiscoverDestinSection /> */}
      <GallerySection />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center 
        bg-black/30 backdrop-blur-sm z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Notice
            </h2>

            <p className="text-gray-700 mb-4">{error}</p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
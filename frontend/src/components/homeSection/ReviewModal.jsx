import { useState, useEffect } from "react";
import api from "../../api/axios.js";

export default function ReviewModal({ onClose }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
      title: "",
    email: "",
    review: "",
    rating: 5,
    listingId: "",
  });
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/listings/published");

      setProperties(res.data.properties || res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/listings/${form.listingId}/reviews`, {
        name: form.firstName + " " + form.lastName,
        message: form.review,
        rating: form.rating,
        email: form.email,
        title: form.title
      });

      alert("Review submitted!");
      onClose();
    } catch {
      alert("Failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-xl p-6 relative">
        {/* CLOSE */}
        <button onClick={onClose} className="absolute right-3 top-2 text-xl">
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Write Review</h2>

        {/* FORM */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              placeholder="First Name"
              className="border p-2 w-full rounded"
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <input
              placeholder="Last Name"
              className="border p-2 w-full rounded"
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div className="w-full">
            <label className="block mb-2 font-semibold">Select Property</label>

            <select
              value={form.listingId}
              onChange={(e) => setForm({ ...form, listingId: e.target.value })}
              className="w-full border rounded-xl p-3 outline-none"
            >
              <option value="">Select Property</option>

              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.property?.title}
                </option>
              ))}
            </select>
          </div>
           <input
            placeholder="Reviews Title"
            className="border p-2 w-full rounded"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Email"
            className="border p-2 w-full rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <textarea
            placeholder="Your Review"
            className="border p-2 w-full rounded"
            rows={4}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white w-full py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

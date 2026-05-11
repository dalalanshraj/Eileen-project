import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { FaCheck, FaTrash, FaEye, FaReply } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";

export default function ReviewsTab({ listingId }) {
  const [reviewForm, setReviewForm] = useState({
  firstName: "",
  lastName: "",
   title: "",
  email: "",
  stayDate:"",
  review: "",
  rating: "",
});
  const [reviews, setReviews] = useState([]);
  const [openReview, setOpenReview] = useState(null);
  const [replyReview, setReplyReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);


  const fetchReviews = async () => {
    const res = await api.get(`/listings/${listingId}`);
    setReviews(res.data.reviews || []);
  };

  useEffect(() => {
    if (listingId) fetchReviews();
  }, [listingId]);

  const publishReview = async (id) => {
    await api.put(`/listings/${listingId}/reviews/${id}/publish`);
    fetchReviews();
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete review?")) return;
    await api.delete(`/listings/${listingId}/reviews/${id}`);
    fetchReviews();
  };

  const saveReply = async () => {
    await api.put(`/listings/${listingId}/reviews/${replyReview._id}/reply`, {
      reply: replyText,
    });
    setReplyReview(null);
    setReplyText("");
    fetchReviews();
  };
  const submitReview = async () => {
  try {
    await api.post(`/listings/${listingId}/reviews`, {
      name:
        reviewForm.firstName +
        " " +
        reviewForm.lastName,
      email: reviewForm.email,
      title:reviewForm.title,
      stayDate:reviewForm.stayDate,
      message: reviewForm.review,
      rating: reviewForm.rating,
    });

    alert("Review Added");

    setShowReviewModal(false);

    setReviewForm({
      firstName: "",
      lastName: "",
      email: "",
      title:"",
      stayDate:"",
      review: "",
      rating: 5,
    });

    fetchReviews();
  } catch (error) {
    console.log(error);
    alert("Failed");
  }
};

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Property Reviews</h2>

          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            Add Review
          </button>
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Reviews</th>
                <th className="p-3 text-left">Reviews By</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50 ">
                  <td className="p-3">
                    <p className="font-semibold">{r.title}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{r.name}</p>
                    {/* <p className="text-xs text-gray-500">
                     
                  </p> */}
                  </td>

                  <td className="p-3 text-center flex"><IoMdStar size={21} className="text-[#ffd250]"/> {r.rating}</td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        r.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.published ? "Published" : "Pending"}
                    </span>
                  </td>

                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => setOpenReview(r)}
                      className="p-2 rounded bg-blue-100 text-blue-600 cursor-pointer"
                    >
                      <FaEye />
                    </button>

                    {!r.published && (
                      <button
                        onClick={() => publishReview(r._id)}
                        className="p-2 rounded bg-green-100 text-green-600 cursor-pointer"
                      >
                        <FaCheck />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setReplyReview(r);
                        setReplyText(r.reply || "");
                      }}
                      className="p-2 rounded bg-purple-100 text-purple-600 cursor-pointer"
                    >
                      <FaReply />
                    </button>

                    <button
                      onClick={() => deleteReview(r._id)}
                      className="p-2 rounded bg-red-100 text-red-600 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold">{r.title}</h4>
              <p className="text-xs text-gray-500">
                {r.name} • {r.email}
              </p>

              <div className="flex justify-between mt-2">
                <span className="flex"><IoMdStar size={21} className="text-[#ffd250]"/> {r.rating}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    r.published
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {r.published ? "Published" : "Pending"}
                </span>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setOpenReview(r)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded cursor-pointer"
                >
                  View
                </button>
                {!r.published && (
                  <button
                    onClick={() => publishReview(r._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded cursor-pointer"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ===== VIEW MODAL ===== */}
        {openReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-2">{openReview.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {openReview.name} • {openReview.email}
              </p>
              <p className="mb-2 flex"><IoMdStar size={21} className="text-[#ffd250]"/>{openReview.rating}/5</p>
              <p className="bg-gray-100 p-3 rounded">{openReview.message}</p>
              {openReview.reply && (
                <div className="mt-3 bg-green-50 p-3 rounded">
                  <p className="text-sm font-semibold text-green-700">
                    Admin Reply:
                  </p>
                  <p className="text-sm">{openReview.reply}</p>
                </div>
              )}
              <button
                onClick={() => setOpenReview(null)}
                className="mt-4 w-full bg-black text-white py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ===== REPLY MODAL ===== */}
        {replyReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full">
              <h3 className="text-xl font-bold mb-3">Reply to Review</h3>
              <textarea
                rows={4}
                className="w-full border p-3 rounded"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setReplyReview(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showReviewModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    
    <div className="bg-white w-[500px] rounded-xl p-6 relative">

      <button
        onClick={() => setShowReviewModal(false)}
        className="absolute right-3 top-2 text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Add Review
      </h2>

      <div className="space-y-3">

        <div className="flex gap-2">
          <input
            placeholder="First Name"
            className="border p-2 w-full rounded"
            value={reviewForm.firstName}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                firstName: e.target.value,
              })
            }
          />

          <input
            placeholder="Last Name"
            className="border p-2 w-full rounded"
            value={reviewForm.lastName}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                lastName: e.target.value,
              })
            }
          />
        </div>

        <input
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={reviewForm.email}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              email: e.target.value,
            })
          }
        />

       <div className="flex gap-2 mb-3">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() =>
                setReviewForm({ ...reviewForm, rating: star })
              }
              className={
                reviewForm.rating >= star
                  ? "text-yellow-400 text-2xl"
                  : "text-gray-300 text-2xl"
              }
            >
              ★
            </button>
          ))}
        </div>
         <input
            placeholder="Reviews Title"
            className="border p-2 w-full rounded"
            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
          />


        <textarea
          placeholder="Your Review"
          rows={4}
          className="border p-2 w-full rounded"
          value={reviewForm.review}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              review: e.target.value,
            })
          }
        />
        <label className="block mb-2 font-semibold">Stay Dates</label>
        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={reviewForm.stayDate}
          onChange={(e) =>
            setReviewForm({ ...reviewForm, stayDate: e.target.value })
          }
        />

        <button
          onClick={submitReview}
          className="bg-blue-600 text-white w-full py-3 rounded-xl"
        >
          Submit Review
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}

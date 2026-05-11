import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };

  const fetchData = async () => {
    const res = await api.get("/gallery");
    setImages(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const upload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    await api.post("/gallery", formData);
    fetchData();
  };

  const toggle = async (id) => {
    await api.put(`/gallery/${id}/toggle`);
    fetchData();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await api.delete(`/gallery/${id}`);
    fetchData();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Manager</h1>

        {/* UPLOAD BUTTON */}
        <label className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800">
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => upload(e.target.files[0])}
          />
        </label>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative group">
              <img
                src={getImageUrl(img.image)}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  console.log("Gallery IMG ERROR:", e.currentTarget.src);
                  e.target.src = "/placeholder.png";
                }}
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
            </div>

            {/* ACTIONS */}
            <div className="p-3 flex items-center justify-between">
              {/* 🔥 TOGGLE SWITCH */}
              <div
                onClick={() => toggle(img._id)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                  img.status === "published" ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    img.status === "published" ? "translate-x-6" : ""
                  }`}
                />
              </div>

              {/* STATUS TEXT */}
              <span className="text-xs">
                {img.status === "published" ? "Published" : "Draft"}
              </span>

              {/* DELETE BUTTON */}
              <button
                onClick={() => remove(img._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

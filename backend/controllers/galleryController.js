import Gallery from "../models/Gallery.js";

// UPLOAD
export const uploadImage = async (req, res) => {
  try {
    const imagePath = `/gallery-uploads/${req.file.filename}`;

    const data = await Gallery.create({
      image: imagePath,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
};

// GET ALL
export const getAllImages = async (req, res) => {
  const data = await Gallery.find().sort({ createdAt: -1 });
  res.json(data);
};

// GET PUBLISHED (frontend use)
export const getPublishedImages = async (req, res) => {
  const data = await Gallery.find({ status: "published" });
  res.json(data);
};

// TOGGLE
export const toggleStatus = async (req, res) => {
  const item = await Gallery.findById(req.params.id);

  item.status =
    item.status === "published" ? "draft" : "published";

  await item.save();

  res.json(item);
};

// DELETE
export const deleteImage = async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
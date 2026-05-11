import express from "express";
import multer from "multer";
import {
  uploadImage,
  getAllImages,
  getPublishedImages,
  toggleStatus,
  deleteImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "gallery-uploads/"); // 👈 IMPORTANT
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ROUTES
router.post("/", upload.single("image"), uploadImage);
router.get("/", getAllImages);
router.get("/published", getPublishedImages);
router.put("/:id/toggle", toggleStatus);
router.delete("/:id", deleteImage);

export default router;
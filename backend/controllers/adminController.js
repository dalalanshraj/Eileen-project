import dotenv from "dotenv";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
// import Property from "../models/Property.js";
import Listing from "../models/Listing.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
 if (!admin || admin.role !== "admin") {
  return res.status(403).json({ message: "Not an admin" });
}

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.json({
  token,
  name: admin.name,
  email: admin.email,
});

};
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
export const dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListing = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

   let totalReviews = 0;
let pendingReviews = 0;

const listings = await Listing.find({}, { reviews: 1 });

listings.forEach((listing) => {
  if (listing.reviews && listing.reviews.length > 0) {
    totalReviews += listing.reviews.length;

    listing.reviews.forEach((review) => {
      if (review.published === false) {
        pendingReviews++;
      }
    });
  }
});

    res.json({
      totalUsers,
      totalListing,
      totalBookings,
      pendingBookings,
      totalReviews,
      pendingReviews,
    });

  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Dashboard stats error" });
  }
};

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = new User({
    name,
    email,
    password: hashed,
    role: "admin",
  });

  await admin.save();

  res.json({ message: "Admin created successfully" });
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashed,
    role: role || "user",
  });

  await user.save();

  res.json({ message: "User created" });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { name, email, role },
    { new: true }
  );

  res.json(user);
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.email === userToDelete.email) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
};
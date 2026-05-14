import dotenv from "dotenv";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
// import Property from "../models/Property.js";
import Listing from "../models/Listing.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();

export const adminLogin = async (req, res) => {
   console.log(req.body);
  const { email, password } = req.body;
  console.log("EMAIL:", email);
console.log("PASSWORD:", password);

  const admin = await User.findOne({ email });
  if (!admin || (admin.role !== "admin" && admin.role !== "superadmin")) {
    return res.status(403).json({
      message: "Not an admin",
    });
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
    { expiresIn: "1d" },
  );

  res.json({
    token,
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
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
    { new: true },
  );

  res.json(user);
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findById(id);

    // ❌ user not found
    if (!userToDelete) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ❌ cannot delete superadmin
    if (userToDelete.role === "superadmin") {
      return res.status(400).json({
        message: "Cannot delete superadmin",
      });
    }

    // ❌ cannot delete own account
    if (req.user.email === userToDelete.email) {
      return res.status(400).json({
        message: "Cannot delete yourself",
      });
    }

    // ✅ delete
    await User.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Delete error",
    });
  }
};
``;

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, confirmCurrentPassword, newPassword } = req.body;

    // VALIDATION
    if (!currentPassword || !confirmCurrentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // MATCH CURRENT PASSWORDS
    if (currentPassword !== confirmCurrentPassword) {
      return res.status(400).json({
        message: "Current passwords do not match",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK CURRENT PASSWORD
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    // HASH NEW PASSWORD
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;

    // TRACK PASSWORD CHANGE
    user.lastPasswordChanged = new Date();

   await user.save();

await sendEmail(
  "Contact@digifyamerica.com",
  "User Password Changed",
  `
    <h2>Password Changed Alert</h2>

    <p><strong>${user.name}</strong> changed their password.</p>

    <p>Email: ${user.email}</p>

    <p>Time: ${new Date().toLocaleString()}</p>
  `,
);

res.json({
  message: "Password changed successfully",
});
  } catch (err) {

  console.log(err);

  res.status(500).json({
    message: err.message,
  });
}
};

export const resetUserPassword = async (req, res) => {
  try {
    // 🔥 ONLY SUPER ADMIN
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Only super admin allowed",
      });
    }

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // TEMP PASSWORD
    const tempPassword = "Admin@" + Math.floor(1000 + Math.random() * 9000);

    const hashed = await bcrypt.hash(tempPassword, 10);

    user.password = hashed;

    user.lastPasswordChanged = new Date();

    await user.save();

await sendEmail(
  "Contact@digifyamerica.com",
  "User Password Changed",
  `
    <h2>Password Changed Alert</h2>

    <p><strong>${user.name}</strong> changed their password.</p>

    <p>Email: ${user.email}</p>

    <p>Time: ${new Date().toLocaleString()}</p>
  `,
);

res.json({
  message: "Password changed successfully",
  tempPassword,
});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

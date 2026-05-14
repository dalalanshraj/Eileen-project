import express from "express";
import {
  adminLogin,
  getAllUsers,
  dashboardStats,
  createAdmin,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  resetUserPassword,
} from "../controllers/adminController.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Public
router.post("/login", adminLogin);

// 🔐 Protected ADMIN routes
router.get("/dashboard", isAuth, isAdmin, dashboardStats);
router.get("/users", isAuth, isAdmin, getAllUsers);
router.post("/register", createAdmin); // TEMPORARY
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", isAuth, isAdmin, deleteUser);
router.put( "/change-password",isAuth, isAdmin, changePassword)
router.put("/users/:id/reset-password",isAuth, isAdmin,resetUserPassword)
// router.get("/fix-password", async (req, res) => {

//   const user = await User.findOne({
//     email: "digifyamerica@gmail.com"
//   });

//   const hashed = await bcrypt.hash(
//     "Admin@123",
//     10
//   );

//   user.password = hashed;

//   await user.save();

//   res.send("Password fixed");
// });





export default router;

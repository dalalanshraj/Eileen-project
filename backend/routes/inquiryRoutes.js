import express from "express";
import { createInquiry, getAllInquiries , deleteInquiry } from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry);          // user
router.get("/", getAllInquiries); 
router.delete("/:id", deleteInquiry);         // admin

export default router;

import express from "express";
import { getBlockedDates } from "../controllers/icalController.js";

const router = express.Router();

router.get("/calendar/blocked", getBlockedDates);

export default router;
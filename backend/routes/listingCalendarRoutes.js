import express from "express";
import {
  addCalendarDate,
  removeCalendarDate,
  getCalendar,
  blockDates,
  unblockDates,
  cleanDuplicateCalendar,
  clearCalendar,
  importICal,
  resetICal,
} from "../controllers/calendarController.js";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/calendar", isAuth, isAdmin, addCalendarDate);
router.delete("/:id/calendar", isAuth, isAdmin, removeCalendarDate);

router.get("/month", (req, res) => {
  const { year, month } = req.query;

  res.json({
    year,
    month,
    data: [],
  });
});

router.get("/:id/calendar", getCalendar);
router.post("/:id/calendar/block", isAuth, isAdmin, blockDates);
router.post("/:id/calendar/unblock", isAuth, isAdmin, unblockDates);

router.put("/:id/calendar/clean-duplicates", cleanDuplicateCalendar);
router.put("/:id/calendar/clear", clearCalendar);
router.post("/:id/calendar/import-ical", isAuth, isAdmin, importICal);
router.put("/:id/calendar/reset-ical", resetICal);

export default router;
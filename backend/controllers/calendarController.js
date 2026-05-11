import Listing from "../models/Listing.js";
import fetch from "node-fetch";
import ical from "ical";
import mongoose from "mongoose";

const toValidDate = (value) => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const dateOnly = (value) => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;

  // ✅ local date (NO timezone shift)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const normalizeCalendar = (calendar = []) => {
  if (!Array.isArray(calendar)) return [];

  return calendar
    .map((item) => {
      const d = toValidDate(item?.date);
      if (!d) return null;
      d.setHours(12, 0, 0, 0);
      return {
        date: d,
        status: ["A", "R", "H", "CIN", "COUT"].includes(item?.status)
          ? item.status
          : "A",
        source: ["internal", "booking", "admin", "ical"].includes(item?.source)
          ? item.source
          : "internal",
        price: item?.price,
      };
    })
    .filter(Boolean);
};

export const addCalendarDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status = "R", source = "admin", price } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date required" });
    }

    const validDate = toValidDate(date);
    if (!validDate) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    listing.calendar = normalizeCalendar(listing.calendar);

    const target = dateOnly(validDate);

    listing.calendar = listing.calendar.filter(
      (c) => dateOnly(c.date) !== target,
    );

    listing.calendar.push({
      date: validDate,
      status,
      source,
      price,
    });

    listing.calendar = normalizeCalendar(listing.calendar);

    await listing.save();

    res.json({
      message: "Calendar updated successfully",
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error("addCalendarDate error:", err);
    res.status(500).json({ error: "Calendar update failed" });
  }
};

export const removeCalendarDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date required" });
    }

    const validDate = toValidDate(date);
    if (!validDate) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    listing.calendar = normalizeCalendar(listing.calendar);

    const target = dateOnly(validDate);

    listing.calendar = listing.calendar.filter(
      (c) => dateOnly(c.date) !== target,
    );

    await listing.save();

    res.json({
      message: "Date removed successfully",
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error("removeCalendarDate error:", err);
    res.status(500).json({ error: "Failed to remove date" });
  }
};

export const getCalendar = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({
      calendar: normalizeCalendar(listing.calendar),
      icalUrl: listing.icalUrl || "",
    });
  } catch (err) {
    console.error("getCalendar error:", err);
    res.status(500).json({ error: "Calendar fetch failed" });
  }
};

export const blockDates = async (req, res) => {
  try {
    const { startDate, endDate, status = "H", source = "admin" } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date required" });
    }

    const start = toValidDate(startDate);
    const end = toValidDate(endDate);

    if (!start || !end) {
      return res.status(400).json({ error: "Invalid startDate or endDate" });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ error: "Start date cannot be after end date" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    listing.calendar = normalizeCalendar(listing.calendar);

    for (let i = 0; i <= (end - start) / (1000 * 60 * 60 * 24); i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const key = dateOnly(current);
      if (!key) continue;

      const exists = listing.calendar.some((c) => dateOnly(c.date) === key);

      listing.calendar = listing.calendar.filter(
        (c) => dateOnly(c.date) !== key,
      );

      listing.calendar.push({
        date: current,
        status,
        source,
      });
    }

    listing.calendar = normalizeCalendar(listing.calendar);

    await listing.save();

    res.json({
      message: "Dates blocked successfully",
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error("blockDates error:", err);
    res.status(500).json({ error: "Block failed" });
  }
};

export const unblockDates = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date required" });
    }

    const start = toValidDate(startDate);
    const end = toValidDate(endDate);

    if (!start || !end) {
      return res.status(400).json({ error: "Invalid startDate or endDate" });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ error: "Start date cannot be after end date" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    listing.calendar = normalizeCalendar(listing.calendar);

    const startKey = dateOnly(start);
    const endKey = dateOnly(end);

    listing.calendar = listing.calendar.filter((c) => {
      const key = dateOnly(c.date);

      //  booking dates protect karo
      if (c.source === "booking") return true;

      //  range ke andar wale remove karo
      return key < startKey || key > endKey;
    });

    await listing.save();

    res.json({
      message: "Dates unblocked successfully",
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error("unblockDates error:", err);
    res.status(500).json({ error: "Unblock failed" });
  }
};

export const cleanDuplicateCalendar = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const rank = (item) => {
      if (item?.source === "booking" && item?.status === "R") return 5;
      if (item?.source === "booking" && item?.status === "H") return 4;
      if (item?.source === "admin") return 3;
      if (item?.source === "internal") return 2;
      if (item?.source === "ical") return 1;
      return 0;
    };

    const map = new Map();

    for (const item of listing.calendar) {
      const key = toDateKey(item.date);

      if (!map.has(key)) {
        map.set(key, item);
      } else {
        // booking ko priority do
        if (item.source === "booking") {
          map.set(key, item);
        }
      }
    }

    listing.calendar = Array.from(map.values());
    await listing.save();

    res.json({
      message: "Duplicate calendar cleaned",
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error("cleanDuplicateCalendar error:", err);
    res.status(500).json({ error: "Cleanup failed" });
  }
};

export const clearCalendar = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    listing.calendar = [];
    await listing.save();

    res.json({
      message: "Calendar cleared successfully",
      calendar: [],
    });
  } catch (err) {
    console.error("clearCalendar error:", err);
    res.status(500).json({ error: "Failed to clear calendar" });
  }
};

export const importICal = async (req, res) => {
  try {
    const { id } = req.params;

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "iCal URL required",
      });
    }

    // =====================================
    // FETCH ICAL
    // =====================================

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(400).json({
        error: "Invalid iCal URL",
      });
    }

    const data = await response.text();

    let events;

    try {
      events = ical.parseICS(data);
    } catch (e) {
      console.error("ICS PARSE ERROR:", e);

      return res.status(500).json({
        error: "Invalid iCal format",
      });
    }

    // =====================================
    // FIND LISTING
    // =====================================

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    // =====================================
    // REMOVE OLD ICAL DATA
    // =====================================

    listing.calendar = (listing.calendar || []).filter(
      (c) => c.source !== "ical",
    );

    const bookingDates = [];

    // =====================================
    // LOOP EVENTS
    // =====================================

    // 🔥 parse all bookings
    for (const key in events) {
      const event = events[key];

      if (event.type !== "VEVENT") continue;

      if (!event.start || !event.end) continue;

      // ✅ FORCE LOCAL SAFE DATES
      const start = new Date(
        event.start.getFullYear(),
        event.start.getMonth(),
        event.start.getDate(),
        12,
        0,
        0,
        0,
      );

      const end = new Date(
        event.end.getFullYear(),
        event.end.getMonth(),
        event.end.getDate(),
        12,
        0,
        0,
        0,
      );

      let current = new Date(start);

      while (current < end) {
        const currentDate = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          12,
          0,
          0,
          0,
        );

        const prevDay = new Date(current);
        prevDay.setDate(prevDay.getDate() - 1);

        const nextDay = new Date(current);
        nextDay.setDate(nextDay.getDate() + 1);

        const isCheckin = current.getTime() === start.getTime();

        const isCheckout = nextDay.getTime() === end.getTime();

        bookingDates.push({
          date: currentDate,

          status: isCheckin ? "CIN" : isCheckout ? "COUT" : "R",

          source: "ical",
        });

        current.setDate(current.getDate() + 1);
      }
    }

    // =====================================
    // MERGE DATES
    // =====================================

    const map = new Map();

    // KEEP MANUAL DATES
    listing.calendar
      .filter((c) => c.source !== "ical")
      .forEach((c) => {
        const key = dateOnly(c.date);

        if (!map.has(key)) {
          map.set(key, []);
        }

        map.get(key).push(c);
      });

    // ADD ICAL DATES
    bookingDates.forEach((d) => {
      const key = dateOnly(d.date);

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push({
        date: d.date,
        status: d.status,
        source: d.source,
      });
    });

    // =====================================
    // FINAL CALENDAR
    // =====================================

    listing.calendar = Array.from(map.values()).flat();

    // REMOVE INVALID
    listing.calendar = listing.calendar.filter((c) => c && c.date);

    // SAVE URL
    listing.icalUrl = url;

    // SAVE
    await listing.save();

    // =====================================
    // RESPONSE
    // =====================================

    res.json({
      message: "iCal imported successfully",
      total: bookingDates.length,
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error("ICAL FINAL ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const resetICal = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    listing.calendar = (listing.calendar || []).filter(
      (c) => c.source !== "ical",
    );

    listing.icalUrl = "";

    await listing.save();

    res.json({
      message: "iCal reset successful",
      calendar: listing.calendar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reset failed" });
  }
};

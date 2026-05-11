import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";

export default function DisplayCalendar() {
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = () => {
    api
      .get("/calendar/blocked")
      .then((res) => setBlockedDates(res.data))
      .catch(console.log);
  };

  const isBlocked = (date) => {
    return blockedDates.some((r) => {
      const s = new Date(r.start);
      const e = new Date(r.end);
      return date >= s && date < e;
    });
  };

  const getDateType = (date) => {
    // 🔥 FIRST → turnover check
    for (let i = 0; i < blockedDates.length; i++) {
      const currentEnd = new Date(blockedDates[i].end);

      for (let j = 0; j < blockedDates.length; j++) {
        const nextStart = new Date(blockedDates[j].start);

        const diff = (nextStart - currentEnd) / (1000 * 60 * 60 * 24);

        if ((diff === 0 || diff === 1) && isSameDay(date, currentEnd)) {
          return "turnover-day";
        }
      }
    }

    // THEN normal logic
    for (let r of blockedDates) {
      const start = new Date(r.start);
      const end = new Date(r.end);

      if (isSameDay(date, start)) return "checkin-day";
      if (isSameDay(date, end)) return "checkout-day";
      if (date > start && date < end) return "blocked-day";
    }

    return "available-day";
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <div className="w-full flex justify-center px-1 sm:px-6 py-10">
      {/* CARD */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-2 md:p-15 sm:p-6">
        {/* HEADING */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-5 tracking-wide">
          Availability Calendar
        </h2>

        {/* CALENDAR */}
        <DatePicker
          inline
          selected={null}
          onChange={() => {}}
          minDate={new Date()}
          dayClassName={getDateType}
          showOtherMonths={false}
          fixedHeight
          filterDate={(date) => {
            const today = new Date();
            return date >= today && !isBlocked(date);
          }}
        />

        {/* LEGEND */}
        <div className="flex justify-center gap-6 mt-6 text-sm flex-wrap">
          {/* Available */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-[#d1fae5] rounded"></span>
            Available
          </div>

          {/* Booked */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-[#5C5CFF] rounded"></span>
            Booked
          </div>

          {/* Check-in */}
          <div className="flex items-center gap-2 ">
            <span
              className="w-4 h-4 rounded border"
              style={{
                background: "linear-gradient(135deg, #5C5CFF 50%, white 50%)",
              }}
            ></span>
            Check-In Only
          </div>

          {/* Check-out */}
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded border"
              style={{
                background: "linear-gradient(315deg, #5C5CFF 50%, white 50%)",
              }}
            ></span>
            Check-Out Only
          </div>

          {/* Turnover */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 relative bg-white rounded border">
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 48%, black 50%, transparent 52%)",
                }}
              ></span>
            </span>
            Turn Over Date
          </div>
        </div>
        <p className="mt-4 text-center">
          <span className="text-[#2f9bad]">Check-in :</span> 4:30 PM /{" "}
          <span className="text-[#2f9bad]">Check-out:</span> 9:00 AM
        </p>
      </div>

      {/* ✅ STYLES */}
      <style>{`

/* MAIN */
.react-datepicker {
  width: 100% !important;
  overflow: hidden;
  position: relative;
  max-width: 320px;
  margin: auto;
  border: none;
  font-family: inherit;
}

/* HEADER */
.react-datepicker__header {
  background: transparent;
  border-bottom: none;
}

/* MONTH */
.react-datepicker__current-month {
  font-weight: 600;
  margin-bottom: 10px;
}

/* KEEP DEFAULT ROW STRUCTURE (IMPORTANT) */
.react-datepicker__week {
  display: flex;
  justify-content: space-between;
}

/* DAY */
.react-datepicker__day,
.react-datepicker__day-name {
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin: 2px;
  border-radius: 8px;
}

/* SMALL MOBILE */
@media (max-width: 400px) {
  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
}

/* DESKTOP */
@media (min-width: 768px) {
  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
}

/* COLORS */
.react-datepicker__day.past-day {
  background: #f1f1f1 !important;
  color: #aaa !important;
}

.react-datepicker__day.blocked-day {
  background: #5C5CFF !important;
  text-decoration: line-through;
  color: white !important;
}

.react-datepicker__day.available-day {
  background: #d1fae5;
}

.react-datepicker__day.checkin-day {
  background: linear-gradient(
    315deg,
    #5C5CFF 50%, 
     0% , #d1fae5
  ) !important;
   color: black
}
  .react-datepicker__day.checkout-day {
  background: linear-gradient(
     135deg,
    #5C5CFF 50%,
    0% , #d1fae5
  ) !important;
   color: black
}
 .react-datepicker__day.turnover-day {
  background: #5C5CFF !important;
  position: relative;
}

.react-datepicker__day.turnover-day::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 48%,
    white 50%,
    transparent 52%
  );
  
}
/* HOVER 
.react-datepicker__day:hover {
  background: #6366f1 !important;
  color: white !important;
}
  .react-datepicker__day--outside-month {
  opacity: 0;
  pointer-events: none;
}*/

`}</style>
    </div>
  );
}

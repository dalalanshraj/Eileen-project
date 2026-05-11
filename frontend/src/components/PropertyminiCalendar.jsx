import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";

export default function PropertyminiCalendar({ listingId }) {
  const [calendarDates, setCalendarDates] = useState([]);

  useEffect(() => {
    if (listingId) {
      fetchDates();
    }
  }, [listingId]);

  const fetchDates = async () => {
    try {
      const res = await api.get(
        `/listings/${listingId}/calendar`
      );

      console.log("CALENDAR API:", res.data);

      setCalendarDates(
        Array.isArray(res.data.calendar)
          ? res.data.calendar
          : Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {
      console.log(err);
    }
  };

  // NORMALIZE DATE
  const normalizeDate = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${
      d.getMonth()
    }-${d.getDate()}`;
  };

  // DAY CLASS
  const getDateType = (date) => {

    const current = normalizeDate(date);

    const found = calendarDates.find(
      (d) => normalizeDate(d.date) === current
    );

    // AVAILABLE
    if (!found) {
      return "available-day";
    }

    // NEXT DAY
    const nextDay = new Date(date);

    nextDay.setDate(nextDay.getDate() + 1);

    const next = calendarDates.find(
      (d) =>
        normalizeDate(d.date) ===
        normalizeDate(nextDay)
    );

    // TURNOVER
    if (
      found.status === "COUT" &&
      next &&
      next.status === "CIN"
    ) {
      return "turnover-day";
    }

    // CHECK-IN
    if (found.status === "CIN") {
      return "checkin-day";
    }

    // CHECK-OUT
    if (found.status === "COUT") {
      return "checkout-day";
    }

    // BOOKED
    if (found.status === "R") {
      return "blocked-day";
    }

    // HOLD
    if (found.status === "H") {
      return "hold-day";
    }

    return "available-day";
  };

  return (
    <div className="w-full">

      <h3 className="text-lg font-semibold text-center mb-4">
        Availability Calendar
      </h3>

     <DatePicker
  inline
  selected={null}
  onChange={() => {}}
  minDate={new Date()}
  dayClassName={getDateType}
  fixedHeight
  showPopperArrow={false}

  // DISABLE PAST DATES
  filterDate={(date) => {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return date >= today;
  }}
/>

      {/* LEGEND */}
      <div className="flex justify-center gap-4 mt-5 flex-wrap text-sm">

        {/* AVAILABLE */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#d1fae5]"></span>
          Available
        </div>

        {/* BOOKED */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#5C5CFF]"></span>
          Booked
        </div>

        {/* CHECK-IN */}
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded border"
            style={{
              background:
                "linear-gradient(135deg, #5C5CFF 50%, #d1fae5 50%)",
            }}
          ></span>
          Check-In
        </div>

        {/* CHECK-OUT */}
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded border"
            style={{
              background:
                "linear-gradient(315deg, #5C5CFF 50%, #d1fae5 50%)",
            }}
          ></span>
          Check-Out
        </div>

        {/* TURNOVER */}
        <div className="flex items-center gap-2">
          <span className="relative w-4 h-4 rounded bg-[#5C5CFF] overflow-hidden">
            <span
              className="absolute w-[140%] h-[2px] bg-white top-1/2 left-[-20%] rotate-45"
            ></span>
          </span>
          Turnover
        </div>

        {/* HOLD */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-yellow-400"></span>
          Hold
        </div>

      </div>

      {/* STYLES */}
      <style>{`

.react-datepicker {
  border: none;
  width: 100%;
  max-width: 320px;
  margin: auto;
  font-family: inherit;
}

.react-datepicker__header {
  background: white;
  border-bottom: none;
}

.react-datepicker__current-month {
  font-weight: 700;
  margin-bottom: 10px;
}

.react-datepicker__day,
.react-datepicker__day-name {
  width: 38px;
  height: 38px;
  line-height: 38px;
  margin: 2px;
  border-radius: 8px;
  position: relative;
}

/* AVAILABLE */
.react-datepicker__day.available-day {
  background-color: #d1fae5 !important;
  color: black !important;
}

/* BOOKED */
.react-datepicker__day.blocked-day {
  background-color: #5C5CFF !important;
  color: white !important;
}

/* HOLD */
.react-datepicker__day.hold-day {
  background-color: #facc15 !important;
  color: black !important;
}

/* CHECK-IN */
.react-datepicker__day.checkin-day {
  background: linear-gradient(
    135deg,
    #5C5CFF 50%,
    #d1fae5 50%
  ) !important;

  color: black !important;
}

/* CHECK-OUT */
.react-datepicker__day.checkout-day {
  background: linear-gradient(
    315deg,
    #5C5CFF 50%,
    #d1fae5 50%
  ) !important;

  color: black !important;
}

/* TURNOVER */
.react-datepicker__day.turnover-day {
  background-color: #5C5CFF !important;
  color: white !important;
  position: relative;
  overflow: hidden;
}

/* DIAGONAL LINE */
.react-datepicker__day.turnover-day::after {
  content: "";

  position: absolute;

  width: 140%;
  height: 2px;

  background: white;

  top: 50%;
  left: -20%;

  transform: rotate(-45deg);

  z-index: 2;
}

/* HOVER */
.react-datepicker__day:hover {
  opacity: 0.9;
}

/* MOBILE */
@media (max-width: 480px) {

  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 34px;
    height: 34px;
    line-height: 34px;
    font-size: 12px;
  }

}
  /* HIDE OUTSIDE DAYS */
.react-datepicker__day--outside-month {
  visibility: hidden;
  pointer-events: none;
}

/* DISABLE PAST DAYS */
.react-datepicker__day--disabled {
  // opacity: 0.1;
  cursor: not-allowed;
}

      `}</style>
    </div>
  );
}
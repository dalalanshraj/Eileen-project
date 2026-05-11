import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";

export default function CalendarTab({ listingId }) {
  const [blockedDates, setBlockedDates] = useState([]);

  const [icalUrl, setIcalUrl] = useState("");

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  // =====================================
  // FETCH DATES
  // =====================================

  useEffect(() => {
    fetchDates();
  }, []);

const fetchDates = () => {

  api
    .get(
      `/calendar/${listingId}/calendar`
    )

    .then((res) => {

      setBlockedDates(
        res.data.calendar || []
      );

      setIcalUrl(
        res.data.icalUrl || ""
      );

    })

    .catch(console.log);

};

  // =====================================
  // SAME DAY
  // =====================================

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // =====================================
  // BLOCKED
  // =====================================

  // const isBlocked = (date) => {
  //   return blockedDates.some((r) => {
  //     const s = new Date(
  //       new Date(r.start).getFullYear(),

  //       new Date(r.start).getMonth(),

  //       new Date(r.start).getDate(),
  //     );

  //     const e = new Date(
  //       new Date(r.end).getFullYear(),

  //       new Date(r.end).getMonth(),

  //       new Date(r.end).getDate(),
  //     );

  //     const current = new Date(
  //       date.getFullYear(),

  //       date.getMonth(),

  //       date.getDate(),
  //     );

  //     return current >= s && current < e;
  //   });
  // };

  // =====================================
  // DAY TYPE
  // =====================================
const formatLocalDate = (date) => {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};


const getDateType = (date) => {

  const currentKey =
    formatLocalDate(date);

  const sameDayItems =
    blockedDates.filter((item) => {

      const itemDate = new Date(
        item.date.split("T")[0] + "T12:00:00"
      );

      return (
        formatLocalDate(itemDate)
        === currentKey
      );

    });

  const hasCIN =
    sameDayItems.some(
      (i) => i.status === "CIN"
    );

  const hasCOUT =
    sameDayItems.some(
      (i) => i.status === "COUT"
    );

  const hasR =
    sameDayItems.some(
      (i) => i.status === "R"
    );

  const hasH =
    sameDayItems.some(
      (i) => i.status === "H"
    );

  // ✅ TURNOVER
  if (hasCIN && hasCOUT) {
    return "turnover-day";
  }

  // ✅ CHECK-IN
  if (hasCIN) {
    return "checkin-day";
  }

  // ✅ CHECK-OUT
  if (hasCOUT) {
    return "checkout-day";
  }

  // ✅ BOOKED
  if (hasR) {
    return "blocked-day";
  }

  // ✅ HOLD
  if (hasH) {
    return "hold-day";
  }

  return "available-day";

};
  // =====================================
  // MANUAL DATE SELECT
  // =====================================

  const handleDateSelect = (dates) => {
    const [start, end] = dates;

    setStartDate(start);

    setEndDate(end);
  };

  // =====================================
  // BLOCK DATES
  // =====================================

  const blockDates = async () => {
    if (!startDate || !endDate) {
      return alert("Select date range");
    }

    try {
      await api.post("/calendar/block", {
        start: startDate,

        end: endDate,
      });

      alert("Dates blocked");

      fetchDates();

      setStartDate(null);

      setEndDate(null);
    } catch (err) {
      console.log(err);

      alert("Block failed");
    }
  };

  // =====================================
  // UNBLOCK DATES
  // =====================================

  const unblockDates = async () => {
    if (!startDate || !endDate) {
      return alert("Select date range");
    }

    try {
      await api.post("/calendar/unblock", {
        start: startDate,

        end: endDate,
      });

      alert("Dates unblocked");

      fetchDates();

      setStartDate(null);

      setEndDate(null);
    } catch (err) {
      console.log(err);

      alert("Unblock failed");
    }
  };

  // =====================================
  // IMPORT ICAL
  // =====================================

  const importICal = async () => {
    if (!icalUrl.trim()) {
      return alert("Enter iCal URL");
    }

    try {
      await api.post(
        `/calendar/${listingId}/calendar/import-ical`,

        {
          url: icalUrl,
        },
      );

      alert("iCal imported successfully");

      fetchDates();
    } catch (err) {
      console.log(err);

      alert(err?.response?.data?.error || "iCal failed");
    }
  };
const resetICal = async () => {

  try {

    await api.put(

      `/calendar/${listingId}/calendar/reset-ical`

    );

    alert(
      "iCal reset successful"
    );

    setIcalUrl("");

    fetchDates();

  } catch (err) {

    console.log(err);

    alert(
      "Reset failed"
    );

  }

};
  return (
    <div className="w-full flex justify-center px-1 sm:px-6 py-10">
      {/* CARD */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        {/* TITLE */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-5">
          Availability Calendar
        </h2>

        {/* ICAL INPUT */}

        <div className="mb-4">
          <input
            type="text"
            value={icalUrl}
            onChange={(e) => setIcalUrl(e.target.value)}
            placeholder="Paste iCal URL"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={importICal}
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Import iCal
          </button>
        </div>
<button
  onClick={resetICal}
  className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg"
>
  Reset iCal
</button>
        {/* CALENDAR */}

        <DatePicker
          inline
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateSelect}
          minDate={new Date()}
          dayClassName={getDateType}
          showOtherMonths={false}
          showPopperArrow={false}
          filterDate={(date) => {
            const today = new Date();

            return date >= today;
          }}
        />

        {/* BUTTONS */}

        <div className="flex gap-3 mt-4">
          <button
            onClick={blockDates}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg"
          >
            Block Dates
          </button>

          <button
            onClick={unblockDates}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg"
          >
            Unblock Dates
          </button>
        </div>

        {/* LEGEND */}

        <div className="flex justify-center gap-4 mt-6 text-xs flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-[#d1fae5] rounded"></span>
            Available
          </div>

          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-[#5C5CFF] rounded"></span>
            Booked
          </div>

          <div className="flex items-center gap-1">
            <span
              className="w-4 h-4 rounded border"
              style={{
                background: "linear-gradient(315deg, #5C5CFF 50%, #d1fae5 50%)",
              }}
            ></span>
            Check-In
          </div>

          <div className="flex items-center gap-1">
            <span
              className="w-4 h-4 rounded border"
              style={{
                background: "linear-gradient(135deg, #5C5CFF 50%, #d1fae5 50%)",
              }}
            ></span>
            Check-Out
          </div>
        </div>
      </div>

      {/* CSS */}

      <style>{`

.react-datepicker {
  width: 100% !important;
  max-width: 320px;
  margin: auto;
  border: none;
}

.react-datepicker__week {
  display: flex;
  justify-content: space-between;
}

.react-datepicker__day,
.react-datepicker__day-name {
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin: 2px;
  border-radius: 8px;
}

/* AVAILABLE */
.react-datepicker__day.available-day {
  background: #d1fae5 !important;
  color: black !important;
}

//* AVAILABLE */
.react-datepicker__day.available-day {
  background: #d1fae5 !important;
  color: black !important;
}

/* BOOKED */
.react-datepicker__day.blocked-day {
  background: #5C5CFF !important;
  color: white !important;
}

/* HOLD */
.react-datepicker__day.hold-day {
  background: #facc15 !important;
  color: black !important;
}

/* CHECK-IN */
.react-datepicker__day.checkin-day {
  background: linear-gradient(
    135deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;

  color: black !important;
}

/* CHECK-OUT */
.react-datepicker__day.checkout-day {
  background: linear-gradient(
    315deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;

  color: black !important;
}

/* TURNOVER */
.react-datepicker__day.turnover-day {

  background: linear-gradient(
    135deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;

  position: relative;

  color: black !important;
}

.react-datepicker__day.turnover-day::after {

  content: "";

  position: absolute;

  inset: 0;

  background: linear-gradient(
    135deg,
    transparent 48%,
    white 49%,
    white 51%,
    transparent 52%
  );
}
.react-datepicker__day--outside-month {
  visibility: hidden !important;
  pointer-events: none !important;
}

      `}</style>
    </div>
  );
}


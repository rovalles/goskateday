// js/utils/datetime.js
export const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `<span class="math-inline">\{hours\}\:</span>{minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Parses a date string (YYYY-MM-DD) and a time string (HH:MM AM/PM)
 * into a Date object, interpreted in the local timezone.
 *
 * @param {string} dateStr The date string in "YYYY-MM-DD" format.
 * @param {string} timeStr The time string in "HH:MM AM/PM" format.
 * @returns {Date} A Date object representing the combined date and time in local timezone.
 */
export const parseTimeToDate = (dateStr, timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Adjust hours for 12-hour format
  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0; // 12 AM (midnight) is 0 hours
  }

  // Construct the ISO 8601 string without a timezone offset.
  // When parsed by new Date(), this will be interpreted in the local timezone.
  const isoDateTimeStr = `${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

  return new Date(isoDateTimeStr);
};

/**
 * Checks if a given spot's time range is currently active.
 *
 * @param {object} spot The spot object containing startTime and endTime.
 * @param {string} dateStr The date string (e.g., "2025-05-22") for the spot.
 * @returns {boolean} True if the current time is within the spot's start and end times, false otherwise.
 */
export const isSpotActive = (spot, dateStr) => {
  const now = new Date(); // Current local time
  const start = parseTimeToDate(dateStr, spot.startTime);
  const end = parseTimeToDate(dateStr, spot.endTime);

  // Check if current time is greater than or equal to start, and less than end.
  // This means the spot is active during its start minute, but not its end minute.
  return now >= start && now < end;
};

export function formatEventDate(raw) {
  if (!raw) return "Loading...";
  const date = new Date(`${raw}T00:00:00-05:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats an hour (0-23) into a 12-hour string with AM/PM (e.g., "10:00 AM", "1:00 PM").
 * @param {number} hour The hour in 24-hour format (0-23).
 * @returns {string} The formatted time string.
 */
export function formatHour(hour) {
  const h = hour % 12 || 12; // Convert 0 to 12 for 12 AM/PM
  const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
}

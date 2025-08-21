// js/utils/url-utils.js

export function updateURLWithYear(year) {
  const url = new URL(window.location);
  url.searchParams.set("year", year);
  window.history.replaceState({}, "", url);
}

export function getYearFromURL(yearsArray) {
  const params = new URLSearchParams(window.location.search);
  const year = params.get("year");
  if (yearsArray.includes(year)) {
    return year;
  }
  return null; // Return null if year not found or invalid
}

export function getDebugFromURL() {
  return new URLSearchParams(window.location.search).get("debug") === "true";
}

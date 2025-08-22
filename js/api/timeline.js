import { formatHour } from "/js/utils/datetime.js";

/**
 * Fetches timeline data for a specific year.
 * @param {string} year - The year for which to fetch data (e.g., '2024').
 * @param {boolean} isDebugMode - True if debug mode is active, to load sample data.
 * @returns {Promise<Object>} A promise that resolves with the timeline data, or an empty/error object.
 */
export async function fetchTimelineDataForYear(year, isDebugMode) {
  let filename = `${year}.json`;
  if (isDebugMode) {
    filename = `sample-${year}.json`; // Load sample data in debug mode
  }
  // CHANGED PATH: Use an absolute path from the server root
  const path = `/data/${filename}`;

  console.log(`Fetching data for ${year} from: ${path}`);
  try {
    const response = await fetch(path);
    if (!response.ok) {
      // Handle 404 (Not Found) specifically
      if (response.status === 404) {
        console.warn(
          `No data file found for ${year} at ${path}. Returning empty data.`,
        );
        // Return a default empty structure for years with no data
        return {
          date: "No data",
          spots: [],
          galleryId: "noData",
          galleryImages: [],
        };
      } else {
        // For other HTTP errors, throw to be caught by the catch block
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      const data = await response.json();
      if (isDebugMode && data.spots?.length > 0) {
        const now = new Date();
        const currentHour = now.getHours();

        // Update the first spot's times using the imported utility function
        data.spots[0].startTime = formatHour(currentHour);
        data.spots[0].endTime = formatHour(currentHour + 1);
        console.log(
          "Debug mode: Updated first spot with current hour:",
          data.spots[0],
        );
      }
      return data;
    }
  } catch (error) {
    console.error(`Could not fetch timeline data for ${year}:`, error);
    // Return an error-indicating structure if fetching fails
    return {
      date: "Error loading data",
      spots: [],
      galleryId: "error",
      galleryImages: [],
    };
  }
}

// js/utils/is.js

function isChecker(instance = null) {
  if (!instance || typeof instance !== "object" || !instance.$data) {
    console.error(
      "[is.js Error]: 'is()' function requires a valid Vue instance ('this') to be passed.",
      instance,
    );
    return {};
  }

  return {
    dataNotReady() {
      const data = instance.currentYearTimelineData;
      return (
        !data || data.date === "Error loading data" || data.date === "No data"
      );
    },
    modalOpen() {
      return instance.showModal;
    },
    showingTimelineSpots() {
      return !instance.hasGallery && isChecker.hasContent(instance.timeline);
    },
    showingMainGallery() {
      return (
        instance.hasGallery &&
        isChecker.hasContent(instance.currentYearGalleryImages)
      );
    },
    isDateInvalid() {
      const dateStr = instance.currentYearTimelineData?.date;
      return (
        !dateStr ||
        dateStr === "N/A" ||
        dateStr === "Error loading data" ||
        dateStr === "No data"
      );
    },
    hasGallery() {
      const data = instance.currentYearTimelineData;
      return (
        !!data?.galleryId ||
        isChecker.hasContent(instance.currentYearGalleryImages)
      );
    },
    hasGalleryImages() {
      return isChecker.hasContent(instance.currentYearGalleryImages);
    },
    hasSponsors() {
      return isChecker.hasContent(instance.currentYearTimelineData?.sponsors);
    },
  };
}

// Static utility method
isChecker.hasContent = (arr) => Array.isArray(arr) && arr.length > 0;

export default isChecker;

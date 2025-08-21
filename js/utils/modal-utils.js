import is from "./is.js";
import logger from "./log.js";

export function openSpotModal(context, index) {
  const spot = context.timeline[index];
  if (spot && is.hasContent(spot.images)) {
    context.modalTitle = `${spot.address} Pictures`;
    context.modalPictures = spot.images;
    context.showModal = true;
    logger.log("Modal opened for spot pictures. modalPictures:", spot.images);
  }
}

export function openAllPicturesModal(context) {
  const isCtx = is(context);
  let allPictures = [];

  if (!isCtx.hasGallery()) {
    context.timeline.forEach((spot) => {
      if (is.hasContent(spot.images)) {
        allPictures = allPictures.concat(spot.images);
      }
    });
  } else {
    allPictures = context.currentYearGalleryImages;
  }

  context.modalPictures = [...new Set(allPictures)];
  context.modalTitle = isCtx.hasGallery()
    ? "Event Gallery"
    : "All Skate Spot Pictures";
  context.showModal = true;

  logger.log(
    "Modal opened for all pictures. modalPictures:",
    context.modalPictures,
  );
}

export function closeModal(context) {
  context.showModal = false;
  context.modalPictures = [];
  logger.log("Modal closed.");
}

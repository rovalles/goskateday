// js/main.js
import { createApp } from "https://unpkg.com/vue@3.4.15/dist/vue.esm-browser.prod.js";

import { ImageSlideshow } from "/js/components/image-slideshow.js";
import HeaderSection from "/js/components/header.js";
import SponsorsSection from "/js/components/sponsors.js";
import ContactFooter from "/js/components/footer.js";
import TimelineSection from "/js/components/timeline.js";
import AppModal from "/js/components/app-modal.js";

import { isSpotActive, formatEventDate } from "/js/utils/datetime.js";
import { updateURLWithYear, getYearFromURL } from "/js/utils/url-utils.js";
import logger from "/js/utils/log.js";
import is from "/js/utils/is.js";

import {
  AVAILABLE_YEARS,
  contactEmail,
  instagramUrl,
  headerImages,
} from "/js/config.js";
import { fetchTimelineDataForYear } from "/js/api/timeline.js";

const { years, selectedYear } = {
  years: AVAILABLE_YEARS,
  selectedYear: AVAILABLE_YEARS[0],
};

createApp({
  components: {
    ImageSlideshow,
    HeaderSection,
    SponsorsSection,
    ContactFooter,
    TimelineSection,
    AppModal,
  },
  data() {
    return {
      years,
      selectedYear,
      contactEmail,
      instagramUrl,
      headerImages,
      showModal: false,
      modalTitle: "",
      modalPictures: [],
      currentYearTimelineData: null,
    };
  },
  computed: {
    timeline() {
      return this.currentYearTimelineData?.spots || [];
    },
    formattedEventDate() {
      const raw = this.currentYearTimelineData?.date;
      return is(this).isDateInvalid() ? "Loading..." : formatEventDate(raw);
    },
    hasGallery() {
      const result = is(this).hasGallery();
      logger.log(`hasGallery for ${this.selectedYear} is ${result}`);
      return result;
    },
    currentYearGalleryImages() {
      const images = this.currentYearTimelineData?.galleryImages || [];
      logger.log(
        `currentYearGalleryImages for ${this.selectedYear} has ${images.length} images.`,
      );
      return images;
    },
    currentYearSponsors() {
      return this.currentYearTimelineData?.sponsors || [];
    },
  },
  methods: {
    isActive(spot) {
      const isCtx = is(this);
      const dateStr = this.currentYearTimelineData?.date;
      if (isCtx.isDateInvalid()) return false;
      const active = isSpotActive(spot, dateStr);
      console.log("dateStr:", dateStr, this.currentYearTimelineData, active);
      return active;
    },
    openSpotPicturesModal(index) {
      const spot = this.timeline[index];
      if (spot && is.hasContent(spot.images)) {
        this.modalTitle = `${spot.address} Pictures`;
        this.modalPictures = spot.images;
        this.showModal = true;
        logger.log(
          "Modal opened for spot pictures. modalPictures:",
          spot.images,
        );
      }
    },
    openAllPicturesModal() {
      const isCtx = is(this);
      let allPictures = [];

      if (!isCtx.hasGallery()) {
        this.timeline.forEach((spot) => {
          if (is.hasContent(spot.images)) {
            allPictures = allPictures.concat(spot.images);
          }
        });
      } else {
        allPictures = this.currentYearGalleryImages;
      }

      this.modalPictures = [...new Set(allPictures)];
      this.modalTitle = isCtx.hasGallery()
        ? "Event Gallery"
        : "All Skate Spot Pictures";
      this.showModal = true;

      logger.log(
        "Modal opened for all pictures. modalPictures:",
        this.modalPictures,
      );
    },
    closeModal() {
      this.showModal = false;
      this.modalPictures = [];
      logger.log("Modal closed.");
    },
  },
  watch: {
    async selectedYear(newYear) {
      updateURLWithYear(newYear);
      this.currentYearTimelineData = await fetchTimelineDataForYear(
        newYear,
        logger.isDebug,
      );
    },
  },
  async mounted() {
    const yearFromURL = getYearFromURL(this.years);
    if (yearFromURL) {
      this.selectedYear = yearFromURL;
    }

    this.currentYearTimelineData = await fetchTimelineDataForYear(
      this.selectedYear,
      logger.isDebug,
    );
  },
}).mount("#app");

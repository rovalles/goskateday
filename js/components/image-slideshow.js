// js/components/ImageSlideshow.js
export const ImageSlideshow = {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "Image Gallery",
    },
    showControls: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentIndex: 0,
      isLoading: false, // State to track image loading
      usePlaceholder: false, // Whether to display a placeholder image
      placeholderImage:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ddd'/%3E%3Ctext x='200' y='150' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='20'%3EImage unavailable%3C/text%3E%3C/svg%3E",
    };
  },
  computed: {
    currentImageSrc() {
      const src =
        this.usePlaceholder || this.images.length === 0
          ? this.placeholderImage
          : this.images[this.currentIndex];
      console.log("ImageSlideshow: currentImageSrc", src);
      return src;
    },
    hasImages() {
      console.log(
        "ImageSlideshow: hasImages",
        this.images.length > 0,
        "images array:",
        this.images,
      );
      return this.images.length > 0;
    },
    canShowSlideshowContent() {
      return this.hasImages;
    },
    canShowLoadingIndicator() {
      return this.isLoading;
    },
    canShowControls() {
      return this.showControls;
    },
    isPrevDisabled() {
      return this.currentIndex === 0 || this.isLoading;
    },
    isNextDisabled() {
      return this.currentIndex === this.images.length - 1 || this.isLoading;
    },
  },
  methods: {
    /**
     * Handles the navigation to the next image, preloading it first.
     */
    next() {
      if (this.currentIndex < this.images.length - 1 && !this.isLoading) {
        const newIndex = this.currentIndex + 1;
        this.loadImage(newIndex);
      }
    },
    /**
     * Handles the navigation to the previous image, preloading it first.
     */
    prev() {
      if (this.currentIndex > 0 && !this.isLoading) {
        const newIndex = this.currentIndex - 1;
        this.loadImage(newIndex);
      }
    },
    /**
     * Resets the slideshow to the first image and stops any loading.
     */
    reset() {
      this.currentIndex = 0;
      this.isLoading = false;
      this.usePlaceholder = false;
    },
    /**
     * Preloads an image at a given index and updates the currentIndex when loaded.
     * @param {number} index The index of the image to load.
     */
    loadImage(index) {
      if (index < 0 || index >= this.images.length) {
        console.warn("Attempted to load image out of bounds:", index);
        return;
      }

      this.isLoading = true; // Indicate that an image is loading
      this.usePlaceholder = false; // Reset placeholder state when loading a new image
      const imageUrl = this.images[index];
      const img = new Image(); // Create a new Image object to preload

      img.onload = () => {
        console.log(`Image loaded successfully: ${imageUrl}`);
        this.currentIndex = index; // Update index only after image is loaded
        this.isLoading = false; // Reset loading state
      };

      img.onerror = (e) => {
        console.error(`Failed to load image: ${imageUrl}`, e);
        const nextIndex = index + 1;
        if (nextIndex < this.images.length) {
          this.loadImage(nextIndex); // Skip to the next image
        } else {
          this.usePlaceholder = true; // No more images, show placeholder
          this.isLoading = false; // Reset loading state
        }
      };

      img.src = imageUrl; // Start loading the image
    },
  },
  watch: {
    images: {
      handler(newImages) {
        console.log("ImageSlideshow: images prop changed to:", newImages);
        this.reset(); // Reset slideshow when images prop changes
        // If there are images, start loading the first one immediately
        if (newImages.length > 0) {
          this.loadImage(0);
        }
      },
      deep: true,
      immediate: true, // Run handler immediately on component creation
    },
  },
  mounted() {
    console.log("ImageSlideshow component mounted!");
  },
  template: `
        <div class="image-slideshow">
            <div v-if="canShowSlideshowContent" class="relative">
                <div class="relative w-full rounded-md overflow-hidden mb-4" style="padding-bottom: 56.25%;">
                    <div v-if="canShowLoadingIndicator" class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-20">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>

                    <img v-show="!isLoading" :src="currentImageSrc" :alt="title" class="absolute inset-0 w-full h-full object-contain" />
                </div>

                <div v-if="canShowControls" class="flex justify-center gap-2">
                    <button @click="prev" :disabled="isPrevDisabled"
                            class="px-3 py-1 bg-gray-200 text-gray-700 rounded focus:outline-none"
                            :class="{ 'opacity-50 cursor-not-allowed': isPrevDisabled }">Previous</button>
                    <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
                    <button @click="next" :disabled="isNextDisabled"
                            class="px-3 py-1 bg-gray-200 text-gray-700 rounded focus:outline-none"
                            :class="{ 'opacity-50 cursor-not-allowed': isNextDisabled }">Next</button>
                </div>
            </div>
            <div v-else class="text-gray-600 text-center py-4">No pictures available.</div>
        </div>
    `,
};

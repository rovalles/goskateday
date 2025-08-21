export default {
  name: "HeaderSection",
  props: {
    headerImages: {
      type: Array,
      required: true,
      default: () => [],
    },
    formattedEventDate: String,
  },
  data() {
    return {
      currentImageIndex: 0,
    };
  },
  mounted() {
    if (this.headerImages.length > 0) {
      // Set interval to change the current image index every 5 seconds
      this.intervalId = setInterval(() => {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % this.headerImages.length;
      }, 5000);
    }
  },
  beforeUnmount() {
    // Clear the interval when the component is unmounted to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  template: `
        <header
            class="relative text-center mb-14 py-16 px-4 rounded-xl shadow overflow-hidden"
        >
            <div
                v-for="(image, index) in headerImages"
                :key="index"
                class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                :style="{ backgroundImage: 'url(/header/' + image + ')', opacity: index === currentImageIndex ? 1 : 0 }"
            ></div>

            <div class="relative z-10">
                <h1 class="font-header text-5xl sm:text-6xl tracking-tight leading-none mb-2">
                    <span class="text-shadow block text-white">go skate day</span>
                    <span class="text-shadow block text-gray-300">dallas</span>
                </h1>
                <p class="text-shadow text-lg text-blue-400 mt-2 mb-4 font-bold">{{ formattedEventDate }}</p>
            </div>
        </header>
    `,
};

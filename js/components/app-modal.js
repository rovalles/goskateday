export default {
  name: "AppModal",
  props: {
    show: Boolean,
    title: String,
    images: Array,
  },
  emits: ["close"],
  components: {
    ImageSlideshow: window.ImageSlideshow, // if you're using a global or registered component
  },
  template: `
    <teleport to="body">
      <div v-if="show" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-xl overflow-hidden max-w-xl w-full">
          <div class="p-4 flex justify-between items-center bg-gray-100">
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 focus:outline-none">×</button>
          </div>
          <div class="p-6">
            <image-slideshow
              :images="images"
              :title="title"
              :show-controls="true"
            ></image-slideshow>
          </div>
        </div>
      </div>
    </teleport>
  `,
};

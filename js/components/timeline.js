// js/components/timeline.js

// Import the 'is' utility. We'll rename it to avoid confusion with the computed property name.
import isUtil from "/js/utils/is.js"; // <--- Renamed the import to 'isUtil'
import { ImageSlideshow } from "/js/components/image-slideshow.js";

export default {
    components: {
        ImageSlideshow,
    },
    props: [
        "currentYearTimelineData",
        "modelValue",
        "years",
        "timeline",
        "hasGallery",
        "currentYearGalleryImages",
        "openAllPicturesModal",
        "openSpotPicturesModal",
        "isActive",
    ],
    emits: ["update:modelValue"],
    computed: {
        selectedYear: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
        // NEW: Expose the instance-specific 'is' functions via a computed property
        // This makes `is(this).whatever()` in the template become `this.is.whatever()`
        is() {
            // Pass the component instance ('this') to create the checker
            return isUtil(this);
        },
        // NEW: Expose the generic 'is' functions via a computed property
        // This makes `is.hasContent(array)` in the template become `this.isGeneric.hasContent(array)`
        isGeneric() {
            // isUtil itself holds the generic methods (like hasContent)
            return isUtil;
        },
    },
    template: `
        <section>
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-primary">
                    {{ hasGallery ? 'Event Pictures' : 'Skate Spots' }}
                </h2>
                <button v-if="!hasGallery && isGeneric.hasContent(timeline)" @click="openAllPicturesModal" class="text-sm font-semibold text-primary hover:underline focus:outline-none">All Pictures</button>
                <select v-model="selectedYear" class="custom-select appearance-none text-white text-lg font-semibold pl-4 pr-10 py-2 rounded shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-white">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>

            <div v-if="is.dataNotReady()" class="text-gray-500 text-center py-8">
                <p v-if="!currentYearTimelineData">Loading data...</p>
                <p v-else-if="currentYearTimelineData.date === 'Error loading data'">Error loading data for {{ selectedYear }}.</p>
                <p v-else-if="currentYearTimelineData.date === 'No data'">No data available for {{ selectedYear }}.</p>
            </div>

            <ol v-else-if="is.showingTimelineSpots()" class="relative border-l-2 border-primary border-dashed space-y-10">
                <li v-for="(spot, index) in timeline" :key="index" class="relative pl-6">
                    <span class="absolute top-2 left-0 border-2 border-white shadow-md z-10 transform -translate-x-1/2" :class="isActive(spot) ? 'active-dot w-5 h-5' : 'w-4 h-4 rounded-full bg-primary'"></span>
                    <div class="bg-gray-50 p-4 rounded shadow-sm hover:shadow-md transition">
                        <div class="text-lg font-semibold">{{ spot.startTime }} - {{ spot.endTime }}</div>
                        <div class="text-sm text-gray-600">{{ spot.address }} - <a :href="spot.mapUrl" target="_blank" class="text-blue-500 underline">Map</a></div>
                        <button v-if="isGeneric.hasContent(spot.images)" @click="openSpotPicturesModal(index)" class="mt-2 text-sm text-blue-500 underline focus:outline-none">Pictures</button>
                    </div>
                </li>
            </ol>

            <div v-else-if="is.showingMainGallery()" class="gallery-slideshow mt-4 bg-gray-50 p-6 rounded-lg shadow-md">
                <image-slideshow
                    :images="currentYearGalleryImages"
                    title="Event Gallery"
                    :show-controls="true"
                ></image-slideshow>
            </div>

            <div v-else class="text-gray-500 text-center py-8">
                No timeline or gallery content found for {{ selectedYear }}.
            </div>
        </section>
    `,
};

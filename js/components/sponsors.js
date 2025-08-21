export default {
  props: ["currentYearSponsors", "selectedYear"],
  template: `
    <section class="mt-20 text-center">
      <h2 class="text-xl font-bold text-primary mb-6">Sponsors</h2>
      <div v-if="currentYearSponsors.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center text-sm sm:text-base">
        <a
          v-for="sponsor in currentYearSponsors"
          :key="sponsor.name"
          :href="sponsor.url"
          target="_blank"
          class="overflow-hidden text-ellipsis whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-medium transition-all duration-200 hover:shadow-md hover:scale-105 text-wrap w-full"
        >
          {{ sponsor.name.replace('@', '') }}
        </a>
      </div>
      <div v-else class="text-gray-500">
        No sponsors listed for {{ selectedYear }} yet.
      </div>
    </section>
  `,
};

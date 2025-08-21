export default {
  props: ["contactEmail", "instagramUrl"],
  template: `
        <section id="contact" class="mt-16 border-t pt-6 text-center text-sm text-gray-600">
            <p v-if="contactEmail">Email: <a :href="'mailto:' + contactEmail" class="underline">{{ contactEmail }}</a></p>
            <p>Instagram: <a :href="instagramUrl" target="_blank" class="underline">{{ instagramUrl.replace('https://', '') }}</a></p>
        </section>
    `,
};

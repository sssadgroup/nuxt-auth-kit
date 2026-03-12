import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: [
    "nuxt",
    "nuxt/schema",
    "@nuxt/schema",
    "@nuxt/kit",
    "vue",
    "@vue/runtime-core",
    "pinia",
    "@pinia/nuxt",
    "pathe",
  ],
});

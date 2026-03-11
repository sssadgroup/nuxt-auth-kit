import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'nuxt',
    'nuxt/schema',
    '@nuxt/schema',
    'vue',
    '@vue/runtime-core',
    'pinia',
    '@pinia/nuxt'
  ]
})

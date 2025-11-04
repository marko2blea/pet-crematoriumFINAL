// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        // Enlace para cargar la fuente 'Quicksand' desde Google Fonts
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap'
        }
      ]
    }
  },
    modules: [
    '@nuxtjs/tailwindcss' 
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})


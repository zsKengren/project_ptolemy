// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", '@nuxtjs/supabase'],
  ui: {    
    icons: ['fa6-brands']  
  },
  supabase: {
    redirect: false
  }
})
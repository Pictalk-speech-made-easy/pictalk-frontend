const axios = require("axios");

export default {
  ssr: false,
  /*
   ** Headers of the page
   */

  head: {
    title: process.env.npm_package_name || "",
    meta: [{
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico"
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#ff5757"
  },
  /*
   ** Global CSS
   */
  css: ["~assets/styles/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/fontawesome"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    "nuxt-buefy"
  ],

  /*
   ** Build configuration
   */
  build: {
    extend(config) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  }
};

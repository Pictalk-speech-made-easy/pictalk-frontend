const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "62symo",
  e2e: {
    baseUrl: 'https://www.pictalk.org',
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

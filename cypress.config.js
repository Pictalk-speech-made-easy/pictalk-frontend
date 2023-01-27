const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "62symo",
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

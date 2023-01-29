const cypressNuxt = require("cypress-nuxt");

module.exports = async (on, config) => { // make sure to include "async"!
  on("file:preprocessor", await cypressNuxt.plugin()); // make sure to include "await"!

  // other plugins...
  return config;
};
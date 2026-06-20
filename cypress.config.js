const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {

    // IMPORTANT : chemin des tests
    specPattern: "cypress/e2e/**/*.cy.js",

    // IMPORTANT : vers le  front
    baseUrl: "http://127.0.0.1:5500",

    env: {
      API_URL: "http://127.0.0.1:5001/api/v1"
    },

    setupNodeEvents(on, config) {
      
    },
  },
});
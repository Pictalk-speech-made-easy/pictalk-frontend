// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add(
  'login',
  (username = Cypress.env('username'), password = Cypress.env('password')) => {

    cy.visit('/') // Load the app in order `cy.window` to work
    cy.window().then(window => {
      cy.intercept('POST', '/auth/signin').as('signin');
      cy.intercept('GET', '/user/notification').as('getNotifications');
      cy.intercept('GET', '/user/root').as('getRoot');
      window.$nuxt.$store.dispatch('authenticateUser', { username, password });
      cy.wait('@signin');
      cy.visit('/pictalk');
      cy.wait('@getNotifications');
      cy.wait('@getRoot');
      cy.url().should('contain', '/pictalk/')
      cy.url().should('contain', '?sidebarPictoId=');
    });
  }
)
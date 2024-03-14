import * as fs from 'fs';
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
  (username = Cypress.env('USERNAME'), password = Cypress.env('PASSWORD')) => {

    cy.visit('/') // Load the app in order `cy.window` to work
    cy.window().then(async window => {
      cy.intercept('POST', '/auth/signin').as('signin');
      cy.intercept('GET', '/user/notification').as('getNotifications');
      cy.intercept('GET', '/user/root', (req) => {
        req.continue((res) => {
          const bodyLength = res.body.length;
          if (bodyLength === 0) {
            cy.get('[data-cy=cypress-emptyCollection]')
          } else {
            cy.get('[data-cy=cypress-pictoList]')
            cy.get('[data-cy=cypress-empty-column]');
            cy.get('[data-cy^=cy-]', { timeout: 10000 }).should('not.have.length', 0);
          }
        })
      }).as('getRoot');
      window.$nuxt.$store.dispatch('authenticateUser', { username, password }, this.$keycloak);
      cy.wait('@signin').its('response.statusCode').should('eq', 201);
      cy.visit('/pictalk');
      cy.wait(['@getNotifications', '@getRoot']);
      cy.url().should('contain', '/pictalk/');
      cy.url().should('contain', '?sidebarPictoId=');

    });
  }
)
Cypress.Commands.add(
  'checkVoicesPopup',
  () => {
    cy.window().then(async window => {
      cy.log('checkVoicesPopup')
      cy.log(window.speechSynthesis.getVoices().length);
      if (!('speechSynthesis' in window) || window.speechSynthesis.getVoices().length < 1) {
        cy.get('[data-cy=cypress-installVoiceModal-close]').click({ multiple: true });
      }
    });
  })

Cypress.Commands.add(
  'createCollection',
  () => {
    cy.window().then(window => {
      cy.intercept('POST', '/collection').as('addCollection');
      cy.fixture('images/logo.jpg').then(async (logo) => {
        const blob = Cypress.Blob.base64StringToBlob(logo, 'image/png')
        const uploadedImage = new File([blob], 'logo.jpg', { type: 'image/jpg' });
        const collectionToCreate = {
          collection: true,
          speech: { "fr": "bonjour", "es": "Hola", "en": "Hello" },
          meaning: { "fr": "bonjour", "es": "Hola", "en": "Hello" },
          color: "#F1F1F1",
          share: 1,
          fatherCollectionId: parseInt(
            window.$nuxt.$route.params.fatherCollectionId,
            10
          ),
          image: uploadedImage,
        };
        let createdCollection = await window.$nuxt.$store.dispatch('addCollection', collectionToCreate);
        cy.wait('@addCollection');
        const index = window.$nuxt.$store.getters.getCollections.findIndex(
          (collection) => collection.id === createdCollection.id
        );
        expect(index).not.to.eq(-1);
        window.$nuxt.$emit("resyncPictoList");
        return createdCollection;
      });
    });
  }
)
// Cypress command to delete a picto
Cypress.Commands.add('deleteCollection', (collectionId, fatherCollectionId) => {
  cy.window().then(window => {
    cy.intercept('DELETE', '/collection/' + '?collectionId=' + collectionId + '&fatherId=' + fatherCollectionId).as('deleteCollection');
    window.$nuxt.$store.dispatch('removeCollection', { collectionId, fatherCollectionId });
    cy.wait('@deleteCollection');
  });
})
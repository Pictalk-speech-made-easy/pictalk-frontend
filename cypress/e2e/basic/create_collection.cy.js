describe('Creates a collection', () => {
  it('Creates a collection', function () {
    cy.login()
    // thus the visit will not start until the promise returned
    // by the application code inside the custom command "login" resolves
    cy.intercept('POST', '/collection').as('addCollection');
    if (window && window.innerWidth < 1216) {
      cy.get('[class="navbar-burger burger"]').click();
    }
    cy.get('[data-cy="pictalk-navbar-admin-button"]').click();
    cy.get('[data-cy="pictalk-navbar-create-button"]').click();
    cy.get('[data-cy="pictalk-navbar-create-collection-button"]').click();
    cy.get('[data-cy="picto-steps-search-input"]').clear('m');
    cy.get('[data-cy="picto-steps-search-input"]').type('manger');
    cy.get('[data-cy="picto-steps-search-button"]').click();
    cy.get(':nth-child(1) > .b-tooltip > .tooltip-trigger > #svg').click();
    cy.get('[data-cy="picto-steps-create-edit-collection-button"]').click();
    cy.wait('@addCollection').then((interception) => {
      cy.log('Collection created with id: ' + interception.response.body)
      cy.window().then((window) => {
        cy.deleteCollection(interception.response.body.id, parseInt(
          window.$nuxt.$route.params.fatherCollectionId,
          10
        ),);
      });
    });
  });
})
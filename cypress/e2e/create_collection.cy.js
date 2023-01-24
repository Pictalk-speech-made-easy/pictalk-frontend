describe('Logs in and creates a collection', () => {
  it('Creates a collection', function () {
    cy.login()
    // thus the visit will not start until the promise returned
    // by the application code inside the custom command "login" resolves
    cy.get('[data-cy="pictalk-navbar-admin-button"]').click();
    cy.get('[data-cy="pictalk-navbar-create-button"]').click();
    cy.get('[data-cy="pictalk-navbar-create-pictogram-button"]').click();
    cy.get('[data-cy="picto-steps-search-input"]').clear('m');
    cy.get('[data-cy="picto-steps-search-input"]').type('manger');
    cy.get('[data-cy="picto-steps-search-button"] > .icon > .mdi').click();
    cy.get(':nth-child(1) > .b-tooltip > .tooltip-trigger > #svg').click();
    cy.get('[data-cy="picto-steps-create-edit-pictogram-button"]').click();
  });
})
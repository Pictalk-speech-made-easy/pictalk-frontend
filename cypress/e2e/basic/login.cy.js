
describe('Logs in programmatically', () => {

  it('Login', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('/');
    cy.get('.navbar-burger').click();
    cy.get('[data-cy="navbar-signin-button"] > span').click();
    cy.get('[data-cy="signin-email"]').clear('a');
    cy.get('[data-cy="signin-email"]').type('alex@pictalk.org');
    cy.get('[data-cy="signin-password"]').clear();
    cy.get('[data-cy="signin-password"]').type('Alex1997');
    cy.get('[data-cy="signin-signin"] > span').click();
    cy.url().should('contain', '/pictalk')
    cy.get('[data-cy="pictalk-navbar-admin-button"]').should('be.visible')
    /* ==== End Cypress Studio ==== */
  });
});
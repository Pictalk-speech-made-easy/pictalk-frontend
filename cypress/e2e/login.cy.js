
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

    /* ==== End Cypress Studio ==== */
  });
});
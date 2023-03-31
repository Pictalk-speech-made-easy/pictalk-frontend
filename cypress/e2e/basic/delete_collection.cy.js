describe('Deletes a collection', () => {
  it('Deletes a collection', function () {
    cy.login();
    cy.createCollection().then((createdCollection) => {
      if (window && window.innerWidth < 1216) {
        cy.get('[class="navbar-burger burger"]').click();
      }
      cy.get('[data-cy="pictalk-navbar-admin-button"]').click();
      cy.get('[data-cy="cy-' + createdCollection.id + '"]').find('[data-cy="picto-action-dropdown"]').click();
      cy.get('[data-cy="picto-action-dropdown-delete"]').click();
      cy.get('[data-cy="delete-picto-meaning"]').type(createdCollection.meaning.fr);
      cy.get('[data-cy="delete-picto-button"]').click();
      cy.get('[data-cy="cy-' + createdCollection.id + '"]').should('not.exist');
    });
  });
});
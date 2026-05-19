describe('Login test', () => {

  it('should login successfully', () => {

    cy.visit('/views/auth/login.html');

    cy.get('#email').type('badreddine@yahoo.fr');
    cy.get('#password').type('Setif_19000');

    cy.get('button[type="submit"]').click();

    // vérifier redirection
    cy.url().should('include', 'dashboard');
  });

});
describe('Login', () => {

  it('should login successfully', () => {

    cy.visit('/views/auth/login.html');

    cy.get('#email').type(Cypress.env('email'));
    cy.get('#password').type(Cypress.env('password'));

    cy.get('button[type="submit"]').click();

    cy.url().should('include', 'dashboard');

    cy.contains('Dashboard').should('exist');
  });

});
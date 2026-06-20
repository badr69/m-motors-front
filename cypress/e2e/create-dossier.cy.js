describe('Create dossier', () => {

  it('should create a dossier', () => {

    // login
    cy.visit('/views/auth/login.html');

    cy.get('#email').type(Cypress.env('email'));
    cy.get('#password').type(Cypress.env('password'));

    cy.get('button[type="submit"]').click();

    // create dossier
    cy.visit('/views/dossiers/create-dossier.html');

    cy.get('#vehicle_id').select(1);
    cy.get('#message').type('Test Cypress dossier');

    cy.get('button[type="submit"]').click();

    cy.contains('Dossier créé').should('exist');
  });

});
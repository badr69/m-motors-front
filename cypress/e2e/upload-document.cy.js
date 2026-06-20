describe('Upload document', () => {

  it('should upload document successfully', () => {

    // login
    cy.visit('/views/auth/login.html');

    cy.get('#email').type(Cypress.env('email'));
    cy.get('#password').type(Cypress.env('password'));

    cy.get('button[type="submit"]').click();

    // upload page
    cy.visit('/views/documents/create-document.html?dossier_id=1');

    cy.get('#file').selectFile('cypress/fixtures/test.pdf');

    cy.get('button[type="submit"]').click();

    cy.contains('Upload').should('exist');
  });

});
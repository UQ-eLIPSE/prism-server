///<reference types="cypress" />

import { testEachZone } from "../testutils";

testEachZone((zone: Cypress.PrismZone) => {
  describe("Test case: When user selected a mininode on minimap, should be able to update coordinates via input form", () => {
    beforeEach(() => {
      cy.accessZone(zone);
    });

    it(`Testing: user changes coordinates input in the form, the targeted mininode position changes correctly based on user input`, () => {
      if (zone.adminUser) {
        cy.intercept('PATCH', '/api/node/coords/*').as('patchNode');
        cy.intercept('GET', '/api/site/*/*/survey/minimapSingleSite*').as('getMinimapData');

        cy.get('i[class*="fa-expand-arrows-alt"]').click({ force: true });
        cy.get("p").contains("Edit Node").should("exist").click();
        cy.get("h2").contains("Select a Node to Edit");
        
        const firstX =  60;
        cy.get("[data-cy='selected-node']").click();
        cy.wait('@getMinimapData').then(() => {
          cy.get("input[id='x']").should("exist").clear();
          cy.get("input[id='x']").should("exist").type(String(firstX));        
          cy.get("button").contains("Save").click();        
          cy.wait('@patchNode').then(() => {          
            cy.wait('@getMinimapData').then(() => {
              cy.get("img[class*='minimap_largeMapImg']").then(($img) => {
                const totalWidth = $img.width();
                cy.wrap(totalWidth).should('not.be.undefined');          
                cy.get("[data-cy='selected-node']")
                  .parent()
                  .should(($parent) => {
                    const leftPixelValue = parseFloat($parent.css("left"));
                    const leftPercentage = Math.floor((leftPixelValue / (totalWidth as number)) * 100);
                    console.log("leftPixelValue 2", leftPixelValue);
                    console.log("leftPercentage 2", leftPercentage);
                    expect(leftPercentage).to.be.closeTo(firstX, 1);
                });
              });  
            });          
          });
        });



        cy.get("p").contains("Edit Node").should("exist").click();
        cy.get("h2").contains("Select a Node to Edit");
        const secondX =  30;
        cy.get("[data-cy='selected-node']").click();
        cy.wait('@getMinimapData');
        cy.get("input[id='x']").should("exist").clear();
        cy.get("input[id='x']").should("exist").type(String(secondX));        
        cy.get("button").contains("Save").click();        
        cy.wait('@patchNode').then(() => {          
          cy.wait('@getMinimapData').then(() => {
            cy.get("img[class*='minimap_largeMapImg']").then(($img) => {
              const totalWidth = $img.width();
              cy.wrap(totalWidth).should('not.be.undefined');          
              cy.get("[data-cy='selected-node']")
                .parent()
                .should(($parent) => {
                  const leftPixelValue = parseFloat($parent.css("left"));
                  const leftPercentage = Math.floor((leftPixelValue / (totalWidth as number)) * 100);
                  console.log("leftPixelValue 2", leftPixelValue);
                  console.log("leftPercentage 2", leftPercentage);
                  expect(leftPercentage).to.be.closeTo(secondX, 1);
              });
            });  
          });          
        });
        



      }
    });
  });
});

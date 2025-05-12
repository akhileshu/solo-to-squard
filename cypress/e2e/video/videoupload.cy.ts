describe("Video - videoupload Page", () => {
  beforeEach(() => {
    cy.visit("/video/upload");
  });

  it("should render correctly", () => {
    cy.contains("videoupload").should("exist");
  });

  // You can add more checks based on known hooks/components
});

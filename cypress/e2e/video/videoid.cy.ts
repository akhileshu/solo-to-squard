describe("Video - videoid Page", () => {
  beforeEach(() => {
    cy.visit("/video/[id]");
  });

  it("should render correctly", () => {
    cy.contains("videoid").should("exist");
  });

  // You can add more checks based on known hooks/components
});

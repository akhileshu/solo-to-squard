describe("Video - videoanalytics Page", () => {
  beforeEach(() => {
    cy.visit("/video/(analytics)");
  });

  it("should render correctly", () => {
    cy.contains("videoanalytics").should("exist");
  });

  // You can add more checks based on known hooks/components
});

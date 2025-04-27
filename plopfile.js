/**
 * exclude jsx props from templates
 * Handlebars only looks for {{ without any space.
 * { { confuses it — it treats it like normal text, not a template expression.
 *
 * todo : sometimes we want to use uiName instead of schemaName ex : editProfile insted of editUser
 * → Use schemaName wherever you talk to backend/db. (user) 
 * → Use uiName wherever you make components, pages, actions. (profile)
 */
module.exports = function (plop) {
  const resourceTargetBasePath = "src/features/{{camelCase name}}";
  plop.setGenerator("resource", {
    description: "Generate full CRUD resource (actions + forms + schemas)",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Resource name (e.g. post, user, product):",
      },
    ],
    actions: [
      // Actions
      {
        type: "add",
        path: `${resourceTargetBasePath}/actions/{{camelCase name}}Actions.ts`,
        templateFile: "plop-templates/actions.hbs",
      },
      // Schemas
      {
        type: "add",
        path: `${resourceTargetBasePath}/schemas/{{camelCase name}}Schemas.ts`,
        templateFile: "plop-templates/schemas.hbs",
      },
      // Create/Edit Form
      {
        type: "add",
        path: `${resourceTargetBasePath}/components/CreateOrEdit{{pascalCase name}}Form.tsx`,
        templateFile: "plop-templates/createOrEditForm.hbs",
      },
      // Delete Form
      {
        type: "add",
        path: `${resourceTargetBasePath}/components/Delete{{pascalCase name}}Form.tsx`,
        templateFile: "plop-templates/deleteForm.hbs",
      },
      
      // Client Rendered Component
      {
        type: "add",
        path: `${resourceTargetBasePath}/components/{{pascalCase name}}RenderClient.tsx`,
        templateFile: "plop-templates/clientRender.hbs",
      },

      // Server Rendered Component
      {
        type: "add",
        path: `${resourceTargetBasePath}/components/{{pascalCase name}}RenderServer.tsx`,
        templateFile: "plop-templates/serverRender.hbs",
      },
    ],
  });
};

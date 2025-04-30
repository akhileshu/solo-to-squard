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
  plop.setGenerator("resource", {
    description: "Generate full CRUD resource (actions + forms + schemas)",
    prompts: [
      {
        type: "input",
        name: "uiName",
        message: "UI Name (e.g. profile, post, product):",
      },
      {
        type: "confirm",
        name: "useDifferentSchemaName",
        message: "Use a different schema name than UI name?",
        default: false,
      },
      {
        type: "input",
        name: "schemaName",
        message: "Schema Name (e.g. user, post, product):",
        when: (answers) => answers.useDifferentSchemaName,
      },
    ],
    actions: function (data) {
      const schemaName = data.useDifferentSchemaName
        ? data.schemaName
        : data.uiName;

      const resourceTargetBasePath = "src/features/{{camelCase uiName}}";

      return [
        {
          type: "add",
          path: `${resourceTargetBasePath}/actions/{{camelCase uiName}}Actions.ts`,
          templateFile: "plop-templates/actions.hbs",
          data: {
            name: data.uiName,
            schemaName: schemaName,
          },
        },
        // Schemas
        {
          type: "add",
          path: `${resourceTargetBasePath}/schemas/{{camelCase uiName}}Schemas.ts`,
          templateFile: "plop-templates/schemas.hbs",
          data: {
            name: data.uiName,
            schemaName: schemaName,
          },
        },
        // Create/Edit Form
        {
          type: "add",
          path: `${resourceTargetBasePath}/components/CreateOrEdit{{pascalCase uiName}}Form.tsx`,
          templateFile: "plop-templates/createOrEditForm.hbs",
          data: {
            name: data.uiName,
            schemaName: schemaName,
          },
        },
        // Delete Form
        {
          type: "add",
          path: `${resourceTargetBasePath}/components/Delete{{pascalCase uiName}}Form.tsx`,
          templateFile: "plop-templates/deleteForm.hbs",
          data: {
            name: data.uiName,
            schemaName: schemaName,
          },
        },

        // Client Rendered Component
        {
          type: "add",
          path: `${resourceTargetBasePath}/components/{{pascalCase uiName}}RenderClient.tsx`,
          templateFile: "plop-templates/clientRender.hbs",
          data: {
            name: data.uiName,
            schemaName: schemaName,
          },
        },

        // Server Rendered Component
        {
          type: "add",
          path: `${resourceTargetBasePath}/components/{{pascalCase uiName}}RenderServer.tsx`,
          templateFile: "plop-templates/serverRender.hbs",
          data: {
            name: data.uiName,
            schemaName: schemaName,
          },
        },
      ];
    },
  });
};

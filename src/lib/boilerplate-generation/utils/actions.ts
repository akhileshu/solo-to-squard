import { ActionType } from "plop";
import { FeatureConfig } from "../types";
import { templatePaths } from "./template-paths";
import { toPascalCase } from "./helpers";
import { targetPaths } from "./target-paths";

export const getActionsForFeature = (feature: FeatureConfig) => {
  const actions: ActionType[] = [];

  /*
  // Components

  if (feature.components?.length) {
    feature.components.forEach((component) => {
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/components/${component}/${component}.tsx`,
        templateFile: templatePaths.component,
        data: { name: component, hooks: feature.hooks, store: feature.store },
      });
    });
  }

  // Index files
  if (false && feature.components?.length) {
    actions.push({
      type: "add",
      path: `src/features/${feature.name}/components/index.ts`,
      templateFile: templatePaths.index,
      data: { exports: feature.components },
    });
  }

  */

  GenerateActionsForFeatureComponents(feature, actions);

  // API Routes
  if (feature.apiRoutes?.length) {
    feature.apiRoutes.forEach((route) => {
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/api/${route}/route.ts`,
        templateFile: templatePaths.apiRoute,
        data: {
          name: route,
          zodSchemas: feature.zodSchemas,
          serverActions: feature.serverActions,
        },
      });
    });
  }

  // Models
  if (feature.dbModel?.length) {
    feature.dbModel.forEach((model) => {
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/models/${model}.ts`,
        templateFile: templatePaths.model,
        data: { name: model, types: feature.types },
      });
    });
  }

  // Hooks
  if (feature.hooks?.length) {
    feature.hooks.forEach((hook) => {
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/hooks/use${hook}.ts`,
        templateFile: templatePaths.hook,
        data: {
          name: hook,
          apiRoutes: feature.apiRoutes,
          types: feature.types,
        },
      });
    });
  }

  // Store
  if (feature.store) {
    actions.push({
      type: "add",
      path: `src/features/${feature.name}/store/${feature.store
        .replace("use", "")
        .replace("Store", "")}.ts`,
      templateFile: templatePaths.store,
      data: {
        name: feature.store.replace("use", "").replace("Store", ""),
        types: feature.types,
      },
    });
  }

  // Zod Schemas
  if (feature.zodSchemas?.length) {
    feature.zodSchemas.forEach((schema) => {
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/schemas/${schema}.ts`,
        templateFile: templatePaths.schema,
        data: { name: schema },
      });
    });
  }

  // Types
  if (feature.types?.length) {
    feature.types.forEach((type) => {
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/types/${type}.ts`,
        templateFile: templatePaths.type,
        data: { name: type },
      });
    });
  }

  // Services
  if (false && feature.services?.length) {
    feature.services.forEach((service) => {
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/services/${service}.ts`,
        templateFile: templatePaths.service,
        data: {
          name: service,
          types: feature.types,
          zodSchemas: feature.zodSchemas,
          dbModel: feature.dbModel,
        },
      });
    });
  }

  // Tests
  if (false && feature.tests) {
    // Component tests
    if (feature.tests.components?.length) {
      feature.tests.components.forEach((test) => {
        const componentName = test.replace(".test.tsx", "");
        actions.push({
          type: "add",
          path: `src/features/${feature.name}/tests/components/${test}`,
          templateFile: templatePaths.componentTest,
          data: { name: componentName },
        });
      });
    }

    // API tests
    if (feature.tests.api?.length) {
      feature.tests.api.forEach((test) => {
        const apiName = test.replace(".test.ts", "");
        actions.push({
          type: "add",
          path: `src/features/${feature.name}/tests/api/${test}`,
          templateFile: templatePaths.apiTest,
          data: { name: apiName },
        });
      });
    }
  }

  // Pages
  if (feature.pages?.length) {
    feature.pages.forEach((page) => {
      const pageName = page.replace(/[\/\(\)\[\]]/g, "");
      actions.push({
        type: "add",
        // path: `src/features/${feature.name}/pages${page}/page.tsx`,
        path: targetPaths.page(page),
        templateFile: templatePaths.page,
        data: {
          name: pageName,
          components: feature.components,
          hooks: feature.hooks,
          store: feature.store,
        },
      });
      actions.push({
        type: "add",
        path: `cypress/e2e/${feature.name}/${pageName}.cy.ts`,
        templateFile: templatePaths.e2e, // define this in your template config
        data: {
          featureName: feature.name,
          pageUrl: page,
          testName: pageName,
        },
      });
    });
  }

  if (feature.hooks?.length) {
    actions.push({
      type: "add",
      path: `src/features/${feature.name}/hooks/index.ts`,
      templateFile: templatePaths.index,
      data: { exports: feature.hooks.map((h) => `use${h}`) },
    });
  }

  if (feature.apiRoutes?.length) {
    actions.push({
      type: "add",
      path: `src/features/${feature.name}/api/index.ts`,
      templateFile: templatePaths.index,
      data: { exports: feature.apiRoutes },
    });
  }

  return actions;
};

export const GenerateActionsForFeatureComponents = (
  feature: FeatureConfig,
  actions: ActionType[]
) => {
  if (feature.components) {
    const { rendering, forms, ui } = feature.components;

    // 🔷 Rendering Components (Unified)
    rendering?.forEach((component) => {
      const data = {
        name: component.name,
        isEditableView: component.option?.isEditableView ?? false,
        renderAsList: component.option?.renderAsList ?? false,
      };

      // Render Server
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/components/${component.name}/render-server.tsx`,
        templateFile: templatePaths.renderServer,
        data,
      });

      // Render Client
      actions.push({
        type: "add",
        path: `src/features/${feature.name}/components/${component.name}/render-client.tsx`,
        templateFile: templatePaths.renderClient,
        data,
      });

      // Optional test file
      if (component.option?.generateTestFile) {
        actions.push({
          type: "add",
          path: `src/features/${feature.name}/components/${component.name}/__tests__/${component.name}.test.tsx`,
          templateFile: templatePaths.componentTest,
          data,
        });
      }
    });

    // 🔷 Form Components (Create, Edit, Delete)
    ["create", "edit", "delete"].forEach((formType) => {
      const formComponents = forms?.[formType as keyof typeof forms];
      formComponents?.forEach((component) => {
        const templateKey = `form${toPascalCase(
          formType
        )}` as keyof typeof templatePaths;

        if (!(templateKey in templatePaths)) {
          throw new Error(`Template path for ${templateKey} not found`);
        }

        const data = { name: component.name };
        actions.push({
          type: "add",
          path: `src/features/${feature.name}/components/${component.name}/${formType}.tsx`,
          templateFile: templatePaths[templateKey],
          data,
        });

        if (component.option?.generateTestFile) {
          actions.push({
            type: "add",
            path: `src/features/${feature.name}/components/${component.name}/__tests__/${formType}.test.tsx`,
            templateFile: templatePaths.componentTest,
            data,
          });
        }
      });
    });

    // 🔷 UI Components (Tables, Modals)
    ["table", "modal"].forEach((uiType) => {
      const uiComponents = ui?.[uiType as keyof typeof ui];
      uiComponents?.forEach((component) => {

        const templateKey = `ui${toPascalCase(
          uiType
        )}` as keyof typeof templatePaths;

        if (!(templateKey in templatePaths)) {
          throw new Error(`Template path for ${templateKey} not found`);
        }
        const data = { name: component.name };
        actions.push({
          type: "add",
          path: `src/features/${feature.name}/components/${component.name}/${uiType}.tsx`,
          templateFile: templatePaths[templateKey],
          data,
        });

        if (component.option?.generateTestFile) {
          actions.push({
            type: "add",
            path: `src/features/${feature.name}/components/${component.name}/__tests__/${uiType}.test.tsx`,
            templateFile: templatePaths.componentTest,
            data,
          });
        }
      });
    });
  }
};

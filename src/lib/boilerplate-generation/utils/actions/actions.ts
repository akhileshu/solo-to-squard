import { ActionType } from "plop";
import { FeatureConfig } from "../../types";
import { targetPaths } from "../target-paths";
import { templatePaths } from "../template-paths";
import { GenerateActionsForFeatureComponents } from "./GenerateActionsForFeatureComponents";
import { GenerateActionsForServerActions } from "./GenerateActionsForServerActions";

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

    // Store
  if (false && feature.store) {
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

  if (false && feature.apiRoutes?.length) {
    actions.push({
      type: "add",
      path: `src/features/${feature.name}/api/index.ts`,
      templateFile: templatePaths.index,
      data: { exports: feature.apiRoutes },
    });
  }

  // API Routes
  if (false && feature.apiRoutes?.length) {
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

  */

  GenerateActionsForFeatureComponents(feature, actions);
  GenerateActionsForServerActions(feature, actions);

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

  return actions;
};



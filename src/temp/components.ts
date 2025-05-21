import { ActionType } from "plop";
import { FeatureConfig } from "../../types";
import { toPascalCase } from "../helpers";
import { templatePaths } from "../template-paths";
import { targetPaths } from "../target-paths";

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
        path: targetPaths.renderServer(feature.name, component.name,data.renderAsList),
        templateFile: templatePaths.renderServer,
        data,
      });

      // Render Client
      actions.push({
        type: "add",
        path: targetPaths.renderClient(
          feature.name,
          component.name,
          data.renderAsList
        ),
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
          path: targetPaths.form(feature.name, component.name , formType),
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
          path: targetPaths.ui(feature.name, component.name , uiType),
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

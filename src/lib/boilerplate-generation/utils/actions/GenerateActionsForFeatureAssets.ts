import { ActionType } from "plop";
import { FeatureConfig } from "../../types";
import { targetPaths } from "../target-paths";
import { templatePaths } from "../template-paths";

export const GenerateActionsForFeatureAssets = (
  feature: FeatureConfig,
  actions: ActionType[]
) => {
  const {
    zodSchemas,
    hooks,
    types,
    utils,
    constants,
    name: featureName,
    prismaSchemas,
  } = feature;

  zodSchemas?.forEach((schemaName) => {
    actions.push({
      type: "add",
      path: targetPaths.schema(featureName, schemaName),
      templateFile: templatePaths.zodSchema,
      data: { name: schemaName },
    });
  });

  hooks?.forEach((hookName) => {
    actions.push({
      type: "add",
      path: targetPaths.hook(featureName, hookName),
      templateFile: templatePaths.hook,
      data: { name: hookName },
    });
  });

  types?.forEach((typeName) => {
    actions.push({
      type: "add",
      path: targetPaths.type(featureName, typeName),
      templateFile: templatePaths.type,
      data: { name: typeName },
    });
  });

  utils?.forEach((utilName) => {
    actions.push({
      type: "add",
      path: targetPaths.util(featureName, utilName),
      templateFile: templatePaths.util,
      data: { name: utilName },
    });
  });

  constants?.forEach((constName) => {
    actions.push({
      type: "add",
      path: targetPaths.constant(featureName, constName),
      templateFile: templatePaths.constant,
      data: { name: constName },
    });
  });

  prismaSchemas?.forEach((schemaName) => {
    actions.push({
      type: "add",
      path: targetPaths.prismaModel(schemaName),
      templateFile: templatePaths.prismaModel,
      data: {
        name: schemaName,
      },
    });
  });
};

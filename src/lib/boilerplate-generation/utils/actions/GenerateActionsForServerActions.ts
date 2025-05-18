import { ActionType } from "plop";
import { FeatureConfig } from "../../types";
import { targetPaths } from "../target-paths";
import { templatePaths } from "../template-paths";

export const GenerateActionsForServerActions = (
  feature: FeatureConfig,
  actions: ActionType[]
) => {
 const serverActions = feature.serverActions;

 // 1. Handle CRUD generation
 if (serverActions?.generateCRUD) {
   actions.push({
     type: "add",
     path: targetPaths.serverAction(feature.name, "crud"),
     templateFile: templatePaths.serverActionsCRUD,
     data: {
       name: feature.name, // For pascalCase, camelCase
       schemaName: feature.name, // or use a different one if needed
     },
   });
 }

 // 2. Handle custom server actions
 if (serverActions?.custom?.length) {
   serverActions.custom.forEach((customAction) => {
     actions.push({
       type: "add",
       path: targetPaths.serverAction(feature.name, "custom", customAction.operation),
       templateFile: templatePaths.serverActionsCustom,
       data: {
         ...customAction,
         featureName: feature.name,
       },
     });
   });
 }
};

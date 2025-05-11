import { Question } from "inquirer";
import { NodePlopAPI } from "plop";
import { featuresList } from "./features.json";
import { PlopData } from "./types";
import { registerHelpers } from "./utils/helpers";
import { getDefaultParts, getPartChoices } from "./utils/prompts";
import { getActionsForFeature } from "./utils/actions";


export default function generate(plop: NodePlopAPI) {
  registerHelpers(plop);

  // Main generator
  plop.setGenerator("feature", {
    description: "Generate a new feature with all boilerplate",
    prompts: [
      {
        type: "list",
        name: "featureName",
        message: "Select feature to generate:",
        choices: featuresList.map((f) => f.name),
      },
      {
        type: "checkbox",
        name: "partsToGenerate",
        message: "Select parts to generate:",
        choices: (answers: PlopData) =>
          getPartChoices(
            featuresList.find((f) => f.name === answers.featureName)!
          ),
        default: (answers: PlopData) =>
          getDefaultParts(
            featuresList.find((f) => f.name === answers.featureName)!
          ),
      } as Question,
    ],
    actions: function (data) {
      const { featureName } = data as PlopData;
      const featureConfig = featuresList.find((f) => f.name === featureName)!;
      return getActionsForFeature(featureConfig);
    },
  });
}

/*
export interface FeatureConfig {
  name: string;
  components: string[];
  apiRoutes?: string[];
  serverActions: string[];
  dbModel: string[];
  zodSchemas: string[];
  hooks: string[];
  types: string[];
  store: string;
  utils: string[];
  constants: string[];
  messages: string[];
  pages: string[];
}
*/

import { Answers } from "inquirer";

type RenderingComponentConfig = {
  name: string;
  option?: {
    generateTestFile?: boolean;
    isEditableView?: boolean;
    renderAsList?: boolean; // true = render list (of detail cards), false/undefined = render detail card
  };
};
type ComponentConfig = {
  name: string;
  option?: {
    generateTestFile?: boolean;
  };
};

type FeatureComponents = {
  rendering?: RenderingComponentConfig[]; // just one list, no client/server split
  forms?: {
    create?: ComponentConfig[];
    edit?: ComponentConfig[];
    delete?: ComponentConfig[];
  };
  ui?: {
    tables?: ComponentConfig[];
    modals?: ComponentConfig[];
  };
};

export interface FeatureConfig {
  name: string;
  // components?: string[];
  components?: FeatureComponents;
  apiRoutes?: string[];
  serverActions?: {
    generateCRUD?: boolean;
    custom: {
      operation: "create" | "read" | "update" | "delete";
      name: string;
    }[];
  };
  dbModel?: string[];
  zodSchemas?: string[];
  hooks?: string[];
  types?: string[];
  store?: string;
  utils?: string[];
  constants?: string[];
  messages?: string[];
  pages?: string[];
  services?: string[];
  permissions?: string[];
  layouts?: string[];
  providers?: string[];
  tests?: {
    components?: string[];
    api?: string[];
    utils?: string[];
  };
  mockData?: string[];
  env?: string[];
  readme?: boolean;
}

export interface PlopData extends Answers {
  featureName: string;
  partsToGenerate?: string[];
}

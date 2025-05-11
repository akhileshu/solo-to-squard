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

export interface FeatureConfig {
  name: string;
  components?: string[];
  apiRoutes?: string[];
  serverActions?: string[];
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
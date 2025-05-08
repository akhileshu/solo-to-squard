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

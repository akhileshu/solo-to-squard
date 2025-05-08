/* eslint-disable @typescript-eslint/no-require-imports */
require("ts-node").register({
  project: "./src/lib/boilerplate-generation/tsconfig.plop.json",
});
module.exports =
  require("./src/lib/boilerplate-generation/plopfile.ts").default;

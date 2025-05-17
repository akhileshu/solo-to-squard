import { toPascalCase } from "./helpers";

const featureBasePath = "src/features";

export const targetPaths = {
  component: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${name}.tsx`,

  componentTest: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${name}.test.tsx`,

  store: (feature: string) => `${featureBasePath}/${feature}/store.ts`,

  page: (page: string) => `src/app/(with-layout)/${page}/page.tsx`,

  renderServer: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/Render${toPascalCase(
      name
    )}.server.tsx`,

  renderClient: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/Render${toPascalCase(
      name
    )}.client.tsx`,

  formCreate: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/Create${toPascalCase(
      name
    )}Form.tsx`,

  formEdit: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/Edit${toPascalCase(
      name
    )}Form.tsx`,

  formDelete: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/Delete${toPascalCase(
      name
    )}Form.tsx`,

  uiTable: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${toPascalCase(
      name
    )}Table.tsx`,

  uiModal: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${toPascalCase(
      name
    )}Modal.tsx`,
};

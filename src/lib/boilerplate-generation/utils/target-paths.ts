import { toJoinedKebabCase, toPascalCase } from "./helpers";

const featureBasePath = "src/features";

export const targetPaths = {
  componentTest: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${name}.test.tsx`,

  /**ex: src/app/(with-layout)/video/upload/page.tsx */
  page: (page: string) => `src/app/(with-layout)/${page}/page.tsx`,

  /**
   * Examples:
   * - For a detail renderer: `"src/features/user/components/User/user-renderer.tsx"`
   * - For a list renderer: `"src/features/user/components/User/user-list-renderer.tsx"`
   */
  renderServer: (
    featureName: string,
    componentName: string,
    renderAsList: boolean
  ) =>
    `${featureBasePath}/${featureName}/components/${componentName}/${toJoinedKebabCase(
      componentName,
      renderAsList ? "list-renderer" : "renderer"
    )}.tsx`,

  /**
   * Examples:
   *
   * // For CRUD actions of a feature called "video":
   * serverAction("video", "crud")
   * // → "src/features/video/actions/video-crud-actions.tsx"
   *
   * // For a custom "read" action of the feature "video":
   * serverAction("video", "custom", "read")
   * // → "src/features/video/actions/video-read-action.tsx"

   */
  serverAction: (
    featureName: string,
    type: "custom" | "crud",
    operation?: "create" | "read" | "update" | "delete"
  ) =>
    `${featureBasePath}/${featureName}/actions/${toJoinedKebabCase(
      featureName,
      type === "custom" ? `${operation}-action` : "CRUD-actions"
    )}.tsx`,

  /**
   * Examples:
   * - For a detail card: `"src/features/user/components/User/User-Detail-Card.tsx"`
   * - For a list view: `"src/features/user/components/User/User-List-View.tsx"`
   */
  renderClient: (
    featureName: string,
    componentName: string,
    renderAsList: boolean
  ) =>
    `${featureBasePath}/${featureName}/components/${componentName}/${toJoinedKebabCase(
      componentName,
      renderAsList ? "List-View" : "Detail-Card"
    )}.tsx`,

  /**ex : src/features/user/components/user/edit-user-form.tsx*/
  form: (featureName: string, componentName: string, formType: string) =>
    `${featureBasePath}/${featureName}/components/${componentName}/${toJoinedKebabCase(
      formType,
      componentName,
      "form"
    )}.tsx`,

  /**ex: src/features/user/components/user/user_table.tsx*/
  ui: (featureName: string, componentName: string, uiType: string) =>
    `${featureBasePath}/${featureName}/components/${componentName}/${toJoinedKebabCase(
      componentName,
      uiType
    )}.tsx`,

  /*
  component: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${name}.tsx`,

  uiTable: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${toPascalCase(
      name
    )}Table.tsx`,

  uiModal: (feature: string, name: string) =>
    `${featureBasePath}/${feature}/components/${name}/${toPascalCase(
      name
    )}Modal.tsx`,

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

  store: (feature: string) => `${featureBasePath}/${feature}/store.ts`,

    */
};

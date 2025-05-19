const templateBasePath = "src/lib/boilerplate-generation/plop-templates";

export const templatePaths = {
  //components
  renderServer: `${templateBasePath}/components/render-server.hbs`,
  renderClient: `${templateBasePath}/components/render-client.hbs`,
  formCreate: `${templateBasePath}/components/form-create.hbs`,
  formEdit: `${templateBasePath}/components/form-edit.hbs`,
  formDelete: `${templateBasePath}/components/form-delete.hbs`,
  uiTable: `${templateBasePath}/components/ui-table.hbs`,
  uiModal: `${templateBasePath}/components/ui-modal.hbs`,
  //
  serverActionsCRUD: `${templateBasePath}/server-actions/serverActionsCRUD.hbs`,
  serverActionsCustom: `${templateBasePath}/server-actions/serverActionsCustom.hbs`,
  serverActionsIndex: `${templateBasePath}/server-actions/index.hbs`,
  //
  pageRoute: `${templateBasePath}/page-route.hbs`,
  zodSchema: `${templateBasePath}/zod-schema.hbs`,
  hook: `${templateBasePath}/hook.hbs`,
  type: `${templateBasePath}/type.hbs`,
  util: `${templateBasePath}/util.hbs`,
  constant: `${templateBasePath}/constant.hbs`,
  prismaModel: `${templateBasePath}/prisma-model.hbs`,

  // untested
  apiTest: `${templateBasePath}/api-test.hbs`,
  service: `${templateBasePath}/service.hbs`,
  componentTest: `${templateBasePath}/component-test.hbs`,
  apiRoute: `${templateBasePath}/api-route.hbs`,
  index: `${templateBasePath}/index.hbs`,
  store: `${templateBasePath}/store.hbs`,
  component: `${templateBasePath}/component.hbs`,
  e2e: `${templateBasePath}/e2e-test.hbs`,
};

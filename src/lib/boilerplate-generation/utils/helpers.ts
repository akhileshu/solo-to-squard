/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import { NodePlopAPI } from "plop";

// export function registerHelpers(plop: NodePlopAPI) {
//   plop.setHelper("firstType", (types: string[] | undefined) =>
//     types ? types[0] : "any"
//   );
//   plop.setHelper("firstZodSchema", (schemas: string[] | undefined) =>
//     schemas ? schemas[0] : "anySchema"
//   );
//   plop.setHelper("firstServerAction", (actions: string[] | undefined) =>
//     actions ? actions[0] : "defaultAction"
//   );
//   plop.setHelper("firstApiRoute", (routes: string[] | undefined) =>
//     routes ? `'/api/${routes[0]}'` : "'api/default'"
//   );
//   plop.setHelper("storeImport", (store: string | undefined) =>
//     store ? store : "useDefaultStore"
//   );
//   plop.setHelper("hookImports", (hooks: string[] | undefined) =>
//     hooks ? hooks.map((h) => `use${h}`).join(", ") : ""
//   );
//   plop.setHelper("properCase", (str: string) =>
//     str.replace(
//       /\w\S*/g,
//       (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//     )
//   );
//   plop.setHelper("camelCase", (str: string) =>
//     str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
//   );
//   plop.setHelper("dashCase", (str: string) =>
//     str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).replace(/^-/, "")
//   );
//   plop.setHelper("first", (array: any[] | undefined) =>
//     array ? array[0] : null
//   );
//   plop.setHelper("joinWithComma", (array: any[] | undefined) =>
//     array ? array.join(", ") : ""
//   );
//   plop.setHelper(
//     "withExtension",
//     (filename: string, ext: string) =>
//       filename.replace(new RegExp(`${ext}$`), "") + ext
//   );
//   plop.setHelper("relativePath", (from: string, to: string) =>
//     path.relative(from, to).replace(/\\/g, "/")
//   );
// }

export function registerHelpers(plop: NodePlopAPI) {
  const safe = <T>(fn: () => T, fallback: T) => {
    try {
      return fn();
    } catch {
      return fallback;
    }
  };

  plop.setHelper("firstType", (types: string[] | undefined) =>
    safe(() => types?.[0] ?? "any", "__MISSING_firstType")
  );

  plop.setHelper("firstZodSchema", (schemas: string[] | undefined) =>
    safe(() => schemas?.[0] ?? "anySchema", "__MISSING_firstZodSchema")
  );

  plop.setHelper("firstServerAction", (actions: string[] | undefined) =>
    safe(() => actions?.[0] ?? "defaultAction", "__MISSING_firstServerAction")
  );

  plop.setHelper("firstApiRoute", (routes: string[] | undefined) =>
    safe(
      () => (routes?.[0] ? `'/api/${routes[0]}'` : "'api/default'"),
      "'__MISSING_apiRoute'"
    )
  );

  plop.setHelper("storeImport", (store: string | undefined) =>
    safe(() => store ?? "useDefaultStore", "__MISSING_store")
  );

  plop.setHelper("hookImports", (hooks: string[] | undefined) =>
    safe(() => hooks?.map((h) => `use${h}`).join(", ") ?? "", "")
  );

  plop.setHelper("properCase", (str: string) =>
    safe(
      () =>
        str.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        ),
      "__ERROR_properCase"
    )
  );

  plop.setHelper("camelCase", (str: string) =>
    safe(
      () => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),
      "__ERROR_camelCase"
    )
  );

  plop.setHelper("dashCase", (str: string) =>
    safe(
      () =>
        str
          .replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
          .replace(/^-/, ""),
      "__ERROR_dashCase"
    )
  );

  plop.setHelper("first", (array: any[] | undefined) =>
    safe(() => array?.[0] ?? null, "__MISSING_first")
  );

  plop.setHelper("joinWithComma", (array: any[] | undefined) =>
    safe(() => array?.join(", ") ?? "", "__MISSING_joinWithComma")
  );

  plop.setHelper("withExtension", (filename: string, ext: string) =>
    safe(
      () => filename.replace(new RegExp(`${ext}$`), "") + ext,
      "__ERROR_withExtension"
    )
  );

  plop.setHelper("relativePath", (from: string, to: string) =>
    safe(
      () => path.relative(from, to).replace(/\\/g, "/"),
      "__ERROR_relativePath"
    )
  );
}

import { AdminUiExtension } from "@vendure/ui-devkit/compiler";

export { ProductRecommendationsPlugin } from "./plugin";

export const ProductRecommendationsInputModule: AdminUiExtension["ngModules"][0] = {
  type: "shared",
  ngModuleFileName: "product-recommendations-input.module.ts",
  ngModuleName: "ProductRecommendationsInputModule",
};

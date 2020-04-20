import { DeepPartial } from "@vendure/common/lib/shared-types";
import { VendureEntity, Product } from "@vendure/core";
export declare enum RecommendationType {
    CROSSSELL = "CROSSSELL",
    UPSELL = "UPSELL"
}
export declare class ProductRecommendation extends VendureEntity {
    constructor(input?: DeepPartial<ProductRecommendation>);
    product: Product;
    recommendation: Product;
    type: RecommendationType;
}

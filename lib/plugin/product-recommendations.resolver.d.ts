import { ProductService, RequestContext, ID, Product } from "@vendure/core";
import { ProductRecommendationService } from "./product-recommendations.service";
import { ProductRecommendation } from "./product-recommendation.entity";
import { Translated } from "@vendure/core/dist/common/types/locale-types";
export declare class ProductRecommendationAdminResolver {
    private productRecommendationService;
    constructor(productRecommendationService: ProductRecommendationService);
    updateCrossSellingProducts(ctx: RequestContext, args: {
        productId: ID;
        productIds: [ID];
    }): Promise<Boolean>;
    updateUpSellingProducts(ctx: RequestContext, args: {
        productId: ID;
        productIds: ID[];
    }): Promise<Boolean>;
    productRecommendations(ctx: RequestContext, args: {
        productId: ID;
    }): Promise<ProductRecommendation[]>;
}
export declare class ProductRecommendationShopResolver {
    private productRecommendationService;
    constructor(productRecommendationService: ProductRecommendationService);
    productRecommendations(ctx: RequestContext, args: {
        productId: ID;
    }): Promise<ProductRecommendation[]>;
}
export declare class ProductRecommendationEntityResolver {
    private productService;
    constructor(productService: ProductService);
    recommendation(ctx: RequestContext, recommendation: ProductRecommendation): Promise<Translated<Product>>;
}

import { ID } from "@vendure/core";
import { RecommendationType } from "./product-recommendation.entity";
export declare type ProductRecommendationInput = {
    product: ID;
    recommendation: ID;
    type: RecommendationType;
};
export declare class ProductRecommendationsPlugin {
}

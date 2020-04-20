import { Connection } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { ID } from "@vendure/core";
import { DeletionResponse } from "@vendure/common/lib/generated-types";
import { ProductRecommendation } from "./product-recommendation.entity";
import { ProductRecommendationInput } from "./index";
export declare class ProductRecommendationService {
    private connection;
    constructor(connection: Connection);
    findAll(options: FindManyOptions<ProductRecommendation> | undefined): Promise<ProductRecommendation[]>;
    findOne(recommendationId: ID): Promise<ProductRecommendation | undefined>;
    create(input: ProductRecommendationInput): Promise<ProductRecommendation>;
    delete(productId: ID, ids: ID[]): Promise<DeletionResponse>;
}

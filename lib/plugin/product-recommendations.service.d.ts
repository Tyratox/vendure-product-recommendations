import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { ID, TransactionalConnection } from "@vendure/core";
import { DeletionResponse } from "@vendure/common/lib/generated-types";
import { ProductRecommendation } from "./product-recommendation.entity";
import { ProductRecommendationInput } from "./index";
export declare class ProductRecommendationService {
    private connection;
    constructor(connection: TransactionalConnection);
    findAll(options: FindManyOptions<ProductRecommendation> | undefined): Promise<ProductRecommendation[]>;
    findOne(recommendationId: ID): Promise<ProductRecommendation | undefined>;
    create(input: ProductRecommendationInput): Promise<ProductRecommendation>;
    delete(ids: ID[]): Promise<DeletionResponse>;
}

import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, In } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import {
  ID,
  RequestContext,
  assertFound,
  patchEntity,
  getEntityOrThrow,
  Product,
} from "@vendure/core";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { ProductRecommendation } from "./product-recommendation.entity";
import { ProductRecommendationInput } from "./product-recommendations";

@Injectable()
export class ProductRecommendationService {
  constructor(@InjectConnection() private connection: Connection) {}

  findAll(
    options: FindManyOptions<ProductRecommendation> | undefined
  ): Promise<ProductRecommendation[]> {
    return this.connection.getRepository(ProductRecommendation).find(options);
  }
  findOne(recommendationId: ID): Promise<ProductRecommendation | undefined> {
    return this.connection
      .getRepository(ProductRecommendation)
      .findOne(recommendationId, { loadEagerRelations: true });
  }

  async create(
    input: ProductRecommendationInput
  ): Promise<ProductRecommendation> {
    const recommendation = new ProductRecommendation({
      product: await this.connection
        .getRepository(Product)
        .findOne(input.product),
      recommendation: await this.connection
        .getRepository(Product)
        .findOne(input.recommendation),
      type: input.type,
    });
    const newRecommendation = await this.connection
      .getRepository(ProductRecommendation)
      .save(recommendation);

    return assertFound(this.findOne(newRecommendation.id));
  }

  async delete(productId: ID, ids: ID[]): Promise<DeletionResponse> {
    try {
      await this.connection
        .createQueryBuilder()
        .delete()
        .from(ProductRecommendation)
        .where({ product: productId, recommendation: In(ids) })
        .execute();

      return {
        result: DeletionResult.DELETED,
      };
    } catch (e) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
}

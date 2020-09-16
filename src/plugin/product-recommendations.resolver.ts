import {
  Args,
  Mutation,
  Resolver,
  Query,
  Parent,
  ResolveField,
} from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ProductService,
  RequestContext,
  ID,
  Product,
} from "@vendure/core";
import { Permission } from "@vendure/common/lib/generated-types";

import { ProductRecommendationService } from "./product-recommendations.service";
import {
  RecommendationType,
  ProductRecommendation,
} from "./product-recommendation.entity";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

@Resolver()
export class ProductRecommendationAdminResolver {
  constructor(
    private productRecommendationService: ProductRecommendationService
  ) {}

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCrossSellingProducts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID; productIds: [ID] }
  ): Promise<Boolean> {
    const recommendations: ProductRecommendation[] = await this.productRecommendationService.findAll(
      {
        where: { product: args.productId, type: RecommendationType.CROSSSELL },
      }
    );

    const recommendationsIds = recommendations.map((r) => r.recommendation.id);

    const toDelete = recommendations
      .filter((r) => !args.productIds.includes(r.recommendation.id))
      .map((r) => r.id);
    const toCreate = args.productIds.filter(
      (r) => !recommendationsIds.includes(r)
    );

    const promises: Promise<any>[] = toCreate.map((id) =>
      this.productRecommendationService.create({
        product: args.productId,
        recommendation: id,
        type: RecommendationType.CROSSSELL,
      })
    );

    if (toDelete.length > 0) {
      promises.push(this.productRecommendationService.delete(toDelete));
    }

    await Promise.all(promises);

    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateUpSellingProducts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID; productIds: ID[] }
  ): Promise<Boolean> {
    const recommendations = await this.productRecommendationService.findAll({
      where: { product: args.productId, type: RecommendationType.UPSELL },
    });

    const recommendationsIds = recommendations.map((r) => r.recommendation.id);

    const toDelete = recommendations
      .filter((r) => !args.productIds.includes(r.recommendation.id))
      .map((r) => r.id);
    const toCreate = args.productIds.filter(
      (r) => !recommendationsIds.includes(r)
    );

    await Promise.all([
      toCreate.map((id) =>
        this.productRecommendationService.create({
          product: args.productId,
          recommendation: id,
          type: RecommendationType.UPSELL,
        })
      ),
      this.productRecommendationService.delete(toDelete),
    ]);

    return true;
  }

  @Query()
  async productRecommendations(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID }
  ): Promise<ProductRecommendation[]> {
    return await this.productRecommendationService.findAll({
      where: { product: args.productId },
    });
  }
}

@Resolver()
export class ProductRecommendationShopResolver {
  constructor(
    private productRecommendationService: ProductRecommendationService
  ) {}

  @Query()
  async productRecommendations(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID }
  ): Promise<ProductRecommendation[]> {
    return await this.productRecommendationService.findAll({
      where: { product: args.productId },
    });
  }
}

@Resolver("ProductRecommendation")
export class ProductRecommendationEntityResolver {
  constructor(private productService: ProductService) {}

  @ResolveField()
  async recommendation(
    @Ctx() ctx: RequestContext,
    @Parent() recommendation: ProductRecommendation
  ): Promise<Translated<Product>> {
    const product = await this.productService.findOne(
      ctx,
      recommendation.recommendation.id
    );

    if (!product) {
      throw new Error(
        `Invalid database records for product recommendation with the id ${recommendation.id}`
      );
    }

    return product;
  }
}

@Resolver("Product")
export class ProductEntityResolver {
  constructor(
    private productRecommendationService: ProductRecommendationService
  ) {}

  @ResolveField()
  async recommendations(
    @Ctx() ctx: RequestContext,
    @Parent() product: Product
  ): Promise<ProductRecommendation[]> {
    return this.productRecommendationService.findAll({
      where: { product: product.id },
    });
  }
}

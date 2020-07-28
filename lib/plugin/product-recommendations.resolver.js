"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const product_recommendations_service_1 = require("./product-recommendations.service");
const product_recommendation_entity_1 = require("./product-recommendation.entity");
let ProductRecommendationAdminResolver = class ProductRecommendationAdminResolver {
    constructor(productRecommendationService) {
        this.productRecommendationService = productRecommendationService;
    }
    async updateCrossSellingProducts(ctx, args) {
        const recommendations = await this.productRecommendationService.findAll({
            where: { product: args.productId, type: product_recommendation_entity_1.RecommendationType.CROSSSELL },
        });
        const recommendationsIds = recommendations.map((r) => r.recommendation.id);
        const toDelete = recommendations
            .filter((r) => !args.productIds.includes(r.recommendation.id))
            .map((r) => r.id);
        const toCreate = args.productIds.filter((r) => !recommendationsIds.includes(r));
        const promises = toCreate.map((id) => this.productRecommendationService.create({
            product: args.productId,
            recommendation: id,
            type: product_recommendation_entity_1.RecommendationType.CROSSSELL,
        }));
        if (toDelete.length > 0) {
            promises.push(this.productRecommendationService.delete(args.productId, toDelete));
        }
        await Promise.all(promises);
        return true;
    }
    async updateUpSellingProducts(ctx, args) {
        const recommendations = await this.productRecommendationService.findAll({
            where: { product: args.productId, type: product_recommendation_entity_1.RecommendationType.UPSELL },
        });
        const recommendationsIds = recommendations.map((r) => r.recommendation.id);
        const toDelete = recommendations
            .filter((r) => !args.productIds.includes(r.recommendation.id))
            .map((r) => r.id);
        const toCreate = args.productIds.filter((r) => !recommendationsIds.includes(r));
        await Promise.all([
            toCreate.map((id) => this.productRecommendationService.create({
                product: args.productId,
                recommendation: id,
                type: product_recommendation_entity_1.RecommendationType.UPSELL,
            })),
            this.productRecommendationService.delete(args.productId, toDelete),
        ]);
        return true;
    }
    async productRecommendations(ctx, args) {
        return await this.productRecommendationService.findAll({
            where: { product: args.productId },
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    core_1.Allow(generated_types_1.Permission.UpdateCatalog),
    __param(0, core_1.Ctx()),
    __param(1, graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductRecommendationAdminResolver.prototype, "updateCrossSellingProducts", null);
__decorate([
    graphql_1.Mutation(),
    core_1.Allow(generated_types_1.Permission.UpdateCatalog),
    __param(0, core_1.Ctx()),
    __param(1, graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductRecommendationAdminResolver.prototype, "updateUpSellingProducts", null);
__decorate([
    graphql_1.Query(),
    __param(0, core_1.Ctx()),
    __param(1, graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductRecommendationAdminResolver.prototype, "productRecommendations", null);
ProductRecommendationAdminResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [product_recommendations_service_1.ProductRecommendationService])
], ProductRecommendationAdminResolver);
exports.ProductRecommendationAdminResolver = ProductRecommendationAdminResolver;
let ProductRecommendationShopResolver = class ProductRecommendationShopResolver {
    constructor(productRecommendationService) {
        this.productRecommendationService = productRecommendationService;
    }
    async productRecommendations(ctx, args) {
        return await this.productRecommendationService.findAll({
            where: { product: args.productId },
        });
    }
};
__decorate([
    graphql_1.Query(),
    __param(0, core_1.Ctx()),
    __param(1, graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductRecommendationShopResolver.prototype, "productRecommendations", null);
ProductRecommendationShopResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [product_recommendations_service_1.ProductRecommendationService])
], ProductRecommendationShopResolver);
exports.ProductRecommendationShopResolver = ProductRecommendationShopResolver;
let ProductRecommendationEntityResolver = class ProductRecommendationEntityResolver {
    constructor(productService) {
        this.productService = productService;
    }
    async recommendation(ctx, recommendation) {
        const product = await this.productService.findOne(ctx, recommendation.recommendation.id);
        if (!product) {
            throw new Error(`Invalid database records for product recommendation with the id ${recommendation.id}`);
        }
        return product;
    }
};
__decorate([
    graphql_1.ResolveField(),
    __param(0, core_1.Ctx()),
    __param(1, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext,
        product_recommendation_entity_1.ProductRecommendation]),
    __metadata("design:returntype", Promise)
], ProductRecommendationEntityResolver.prototype, "recommendation", null);
ProductRecommendationEntityResolver = __decorate([
    graphql_1.Resolver("ProductRecommendation"),
    __metadata("design:paramtypes", [core_1.ProductService])
], ProductRecommendationEntityResolver);
exports.ProductRecommendationEntityResolver = ProductRecommendationEntityResolver;
let ProductEntityResolver = class ProductEntityResolver {
    constructor(productRecommendationService) {
        this.productRecommendationService = productRecommendationService;
    }
    async recommendations(ctx, product) {
        return this.productRecommendationService.findAll({
            where: { product: product.id },
        });
    }
};
__decorate([
    graphql_1.ResolveField(),
    __param(0, core_1.Ctx()),
    __param(1, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext,
        core_1.Product]),
    __metadata("design:returntype", Promise)
], ProductEntityResolver.prototype, "recommendations", null);
ProductEntityResolver = __decorate([
    graphql_1.Resolver("Product"),
    __metadata("design:paramtypes", [product_recommendations_service_1.ProductRecommendationService])
], ProductEntityResolver);
exports.ProductEntityResolver = ProductEntityResolver;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRecommendationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const core_1 = require("@vendure/core");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const product_recommendation_entity_1 = require("./product-recommendation.entity");
let ProductRecommendationService = class ProductRecommendationService {
    constructor(connection) {
        this.connection = connection;
    }
    findAll(options) {
        return this.connection.getRepository(product_recommendation_entity_1.ProductRecommendation).find(options);
    }
    findOne(recommendationId) {
        return this.connection
            .getRepository(product_recommendation_entity_1.ProductRecommendation)
            .findOne(recommendationId, { loadEagerRelations: true });
    }
    async create(input) {
        const recommendation = new product_recommendation_entity_1.ProductRecommendation({
            product: await this.connection
                .getRepository(core_1.Product)
                .findOne(input.product),
            recommendation: await this.connection
                .getRepository(core_1.Product)
                .findOne(input.recommendation),
            type: input.type,
        });
        const newRecommendation = await this.connection
            .getRepository(product_recommendation_entity_1.ProductRecommendation)
            .save(recommendation);
        return (0, core_1.assertFound)(this.findOne(newRecommendation.id));
    }
    async delete(ids) {
        try {
            await this.connection.rawConnection
                .createQueryBuilder()
                .delete()
                .from(product_recommendation_entity_1.ProductRecommendation)
                .where({ id: (0, typeorm_1.In)(ids) })
                .execute();
            return {
                result: generated_types_1.DeletionResult.DELETED,
            };
        }
        catch (e) {
            return {
                result: generated_types_1.DeletionResult.NOT_DELETED,
                message: e instanceof Error ? e.toString() : "",
            };
        }
    }
};
ProductRecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.TransactionalConnection])
], ProductRecommendationService);
exports.ProductRecommendationService = ProductRecommendationService;

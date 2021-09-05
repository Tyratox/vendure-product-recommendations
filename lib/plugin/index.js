"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRecommendationsPlugin = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const core_1 = require("@vendure/core");
const product_recommendation_entity_1 = require("./product-recommendation.entity");
const product_recommendations_resolver_1 = require("./product-recommendations.resolver");
const product_recommendations_service_1 = require("./product-recommendations.service");
const adminSchemaExtension = (0, graphql_tag_1.default) `
  enum RecommendationType {
    CROSSSELL
    UPSELL
  }

  type ProductRecommendation {
    product: Product!
    recommendation: Product!
    type: RecommendationType!
  }
  extend type Query {
    productRecommendations(productId: ID!): [ProductRecommendation!]!
  }

  extend type Mutation {
    updateCrossSellingProducts(productId: ID!, productIds: [ID!]!): Boolean!
    updateUpSellingProducts(productId: ID!, productIds: [ID!]!): Boolean!
  }

  extend type Product {
    recommendations: [ProductRecommendation!]!
  }
`;
const shopSchemaExtension = (0, graphql_tag_1.default) `
  enum RecommendationType {
    CROSSSELL
    UPSELL
  }

  type ProductRecommendation {
    product: Product!
    recommendation: Product!
    type: RecommendationType!
  }
  extend type Query {
    productRecommendations(productId: ID!): [ProductRecommendation!]!
  }
  extend type Product {
    recommendations: [ProductRecommendation!]!
  }
`;
let ProductRecommendationsPlugin = class ProductRecommendationsPlugin {
};
ProductRecommendationsPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        entities: [product_recommendation_entity_1.ProductRecommendation],
        providers: [product_recommendations_service_1.ProductRecommendationService],
        adminApiExtensions: {
            schema: adminSchemaExtension,
            resolvers: [
                product_recommendations_resolver_1.ProductRecommendationAdminResolver,
                product_recommendations_resolver_1.ProductRecommendationEntityResolver,
                product_recommendations_resolver_1.ProductEntityResolver,
            ],
        },
        shopApiExtensions: {
            schema: shopSchemaExtension,
            resolvers: [
                product_recommendations_resolver_1.ProductRecommendationShopResolver,
                product_recommendations_resolver_1.ProductRecommendationEntityResolver,
                product_recommendations_resolver_1.ProductEntityResolver,
            ],
        },
        configuration: (config) => {
            config.customFields.Product.push({
                type: "boolean",
                name: "productRecommendationsEnabled",
                label: [
                    { languageCode: core_1.LanguageCode.en, value: "Has product recommendations" },
                ],
            });
            return config;
        },
    })
], ProductRecommendationsPlugin);
exports.ProductRecommendationsPlugin = ProductRecommendationsPlugin;

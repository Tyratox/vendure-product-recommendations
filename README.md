# Installation

1. Install `vendure-product-recommendations` by using `npm` or `yarn`: `yarn add vendure-product-recommendations`
2. Import the vendure plugin from `vendure-product-recommendations/plugin` and add it the `plugins` section inside `vendure-config.ts`
    import { ProductRecommendationPlugin } from "vendure-product-recommendations/plugin";
	...
	export const config: VendureConfig = {
	    ...
		plugins: [
		    ...,
			ProductRecommendationPlugin
		]
	}
3. (optional) Import the ng module config from `vendure-product-recommendations` and add it to the `AdminUiPlugin` extensions:
    import { ProductRecommendationsInputModule } from "vendure-product-recommendations";
	...
	export const config: VendureConfig = {
	    ...
		plugins: [
		    AdminUiPlugin.init({
				app: compileUiExtensions({
					...
					extensions: [
						{
							extensionPath: path.join(
								__dirname,
								"../node_modules/vendure-product-recommendations/ui-extensions/modules/"
							),
							ngModules: [ProductRecommendationsInputModule],
						},
					]
			})
		]
	}

# Usage

The following graphql endpoints are added:

## Admin

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
        updateCrossSellingProducts(productId: ID!, productIds: [ID!]): Boolean!
        updateUpSellingProducts(productId: ID!, productIds: [ID!]): Boolean!
    }

## Shop

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

# Screenshot
![Screenshot][screenshot]
# About

This vendure plugin adds product recommendations, namely cross- and upselling, to the products. It's up to your frontend to fetch them, a graphql API is provided.

# Screenshot
![Screenshot](https://raw.githubusercontent.com/Tyratox/vendure-product-recommendations/master/screenshot.png)

# Disclaimers

- I haven't worked with angular a lot, I'm sorry if some of my angular code looks more like react. Feel free to tell me what should be done differently.
- **There are no tests yet!**

# Installation

Step 1): Install `vendure-product-recommendations` by using `npm` or `yarn`:

`yarn add vendure-product-recommendations`

Step 2): Import the vendure plugin from `vendure-product-recommendations` and add it the `plugins` section in

`vendure-config.ts`:
	
	import { ProductRecommendationsPlugin } from "vendure-product-recommendations";
	...
	export const config: VendureConfig = {
	  ...
	  plugins: [
	    ...,
		ProductRecommendationsPlugin
	  ]
	}

Step 3): (optional) Import the ng module config from `vendure-product-recommendations` and add it to the `AdminUiPlugin` extensions in:

`vendure-config.ts`:
    
    import { ProductRecommendationsPlugin, ProductRecommendationsInputModule } from "vendure-product-recommendations";
	...
	export const config: VendureConfig = {
	  ...
	  plugins: [
	    AdminUiPlugin.init({
		  app: compileUiExtensions({
		    ...,
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

# Known issues

## Code
- The integration in the admin ui is a little hacky, especially the retrieval of the product and variant id/sku

## UI
- Currently one is required to manually press the save button in addition to the save button for the product
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
const core_1 = require("@angular/core");
const ui_devkit_1 = require("@vendure/ui-devkit");
const rxjs_1 = require("rxjs");
const graphql_1 = require("graphql");
const operators_1 = require("rxjs/operators");
const core_2 = require("@vendure/admin-ui/core");
const router_1 = require("@angular/router");
let ProductRecommendationsControl = class ProductRecommendationsControl {
    constructor(route, dataService) {
        this.route = route;
        this.dataService = dataService;
        this.upSellLoading = true;
        this.crossSellLoading = true;
        this.productInput$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
        this.crossSell = [];
        this.upSell = [];
    }
    ngOnInit() {
        this.route.paramMap.subscribe((paramMap) => {
            this.productId = paramMap.get("id");
            if (this.productId) {
                this.dataService
                    .query(graphql_1.parse(`query ProductRecommendations($productId: ID!){
                productRecommendations(productId: $productId){
                  type
                  recommendation {
                    id
                    name
                  }
                }
              }`), { productId: this.productId })
                    .single$.toPromise()
                    .then((response) => {
                    const res = response;
                    console.log(res);
                    this.crossSell = res.productRecommendations
                        .filter((r) => r.type === "CROSSSELL")
                        .map((r) => ({
                        productId: r.recommendation.id,
                        productName: r.recommendation.name,
                    }));
                    this.upSell = res.productRecommendations
                        .filter((r) => r.type === "UPSELL")
                        .map((r) => ({
                        productId: r.recommendation.id,
                        productName: r.recommendation.name,
                    }));
                    //enable search
                    this.crossSellLoading = false;
                    this.upSellLoading = false;
                    this.searchProducts();
                })
                    .catch((e) => {
                    ui_devkit_1.notify({
                        message: "Product recommendations couldn't be fetched. Check the console.",
                        type: "error",
                    });
                    console.error(e);
                });
            }
        });
    }
    ngOnDestroy() { }
    searchProducts() {
        this.productSearchUpSell$ = this.productInput$.pipe(operators_1.distinctUntilChanged(), operators_1.tap(() => (this.upSellLoading = true)), operators_1.switchMap((term) => this.dataService.product
            .searchProducts(term)
            .stream$.pipe(operators_1.tap(() => (this.upSellLoading = false)))));
        this.productSearchCrossSell$ = this.productInput$.pipe(operators_1.distinctUntilChanged(), operators_1.tap(() => (this.crossSellLoading = true)), operators_1.switchMap((term) => this.dataService.product
            .searchProducts(term)
            .stream$.pipe(operators_1.tap(() => (this.crossSellLoading = false)))));
    }
    saveProductRecommendations() {
        if (this.productId) {
            this.dataService
                .mutate(graphql_1.parse(`mutation updateRecommendations($productId: ID!, $crossSellIds: [ID!]!, $upSellIds: [ID!]!){
              updateCrossSellingProducts(productId: $productId, productIds: $crossSellIds)
              updateUpSellingProducts(productId: $productId, productIds: $upSellIds)
            }`), {
                productId: this.productId,
                crossSellIds: this.crossSell.map((r) => r.productId),
                upSellIds: this.upSell.map((r) => r.productId),
            })
                .toPromise()
                .then(() => ui_devkit_1.notify({
                message: "Product recommendations updated successfully",
                type: "success",
            }))
                .catch((e) => {
                ui_devkit_1.notify({
                    message: "Product recommendations couldn't be updated. Check the console.",
                    type: "error",
                });
                console.error(e);
            });
        }
    }
};
ProductRecommendationsControl = __decorate([
    core_1.Component({
        template: `
    <input type="checkbox" [formControl]="formControl" />
    <div *ngIf="formControl.value">
      <div>Upsells</div>
      <ng-select
        [items]="(productSearchUpSell$ | async)?.search.items"
        [multiple]="true"
        [hideSelected]="true"
        [minTermLength]="3"
        [loading]="upSellLoading"
        [typeahead]="productInput$"
        [(ngModel)]="upSell"
        bindLabel="productName"
      ></ng-select>
      <div>Crosssells</div>
      <ng-select
        [items]="(productSearchCrossSell$ | async)?.search.items"
        [multiple]="true"
        [hideSelected]="true"
        [minTermLength]="3"
        [loading]="crossSellLoading"
        [typeahead]="productInput$"
        [(ngModel)]="crossSell"
        bindLabel="productName"
      ></ng-select>
      <button class="btn btn-primary" (click)="saveProductRecommendations()">
        Save
      </button>
    </div>
  `,
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, core_2.DataService])
], ProductRecommendationsControl);
exports.ProductRecommendationsControl = ProductRecommendationsControl;
let ProductRecommendationsInputModule = class ProductRecommendationsInputModule {
};
ProductRecommendationsInputModule = __decorate([
    core_1.NgModule({
        imports: [core_2.SharedModule],
        declarations: [ProductRecommendationsControl],
        providers: [
            core_2.registerCustomFieldComponent("Product", "productRecommendationsEnabled", ProductRecommendationsControl),
        ],
    })
], ProductRecommendationsInputModule);
exports.ProductRecommendationsInputModule = ProductRecommendationsInputModule;

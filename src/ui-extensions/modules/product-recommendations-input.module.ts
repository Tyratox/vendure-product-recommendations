import {
  NgModule,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { ID, LanguageCode } from "@vendure/core";
import { notify } from "@vendure/ui-devkit";
import { Observable, Subject, of } from "rxjs";
import { parse } from "graphql";
import { distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import {
  SharedModule,
  CustomFieldControl,
  CustomFieldConfigType,
  registerCustomFieldComponent,
  DataService,
} from "@vendure/admin-ui/core";
import { ActivatedRoute } from "@angular/router";

type ProductSearch = {
  search: { items: { productId: ID; productName: string }[] };
};

@Component({
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
})
export class ProductRecommendationsControl
  implements CustomFieldControl, OnInit, OnDestroy {
  productId: ID | null;
  languageCode$: Observable<LanguageCode>;

  customFieldConfig: CustomFieldConfigType;
  formControl: FormControl;
  crossSell: { productId: ID; productName: string }[];
  upSell: { productId: ID; productName: string }[];

  productSearchUpSell$: Observable<ProductSearch>;
  productSearchCrossSell$: Observable<ProductSearch>;
  upSellLoading = true;
  crossSellLoading = true;
  productInput$ = new Subject<string>();

  protected destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    this.crossSell = [];
    this.upSell = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.productId = paramMap.get("id");

      if (this.productId) {
        this.dataService
          .query<
            {
              productRecommendations: {
                type: "CROSSSELL" | "UPSELL";
                recommendation: {
                  id: ID;
                };
              }[];
            },
            { productId: ID }
          >(
            parse(
              `query ProductRecommendations($productId: ID!){
                productRecommendations(productId: $productId){
                  type
                  recommendation {
                    id
                    name
                  }
                }
              }`
            ),
            { productId: this.productId }
          )
          .single$.toPromise()
          .then((response) => {
            const res = <
              {
                productRecommendations: {
                  type: "CROSSSELL" | "UPSELL";
                  recommendation: {
                    id: ID;
                    name: string;
                  };
                }[];
              }
            >response;

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

            this.crossSellLoading = false;
            this.upSellLoading = false;
            this.cdr.detectChanges();

            //enable search
            this.searchProducts();
          })
          .catch((e) => {
            notify({
              message:
                "Product recommendations couldn't be fetched. Check the console.",
              type: "error",
            });
            console.error(e);
          });
      }
    });
  }

  ngOnDestroy() {}

  searchProducts() {
    this.productSearchUpSell$ = this.productInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.upSellLoading = true)),
      switchMap((term) =>
        this.dataService.product
          .searchProducts(term)
          .stream$.pipe(tap(() => (this.upSellLoading = false)))
      )
    );
    this.productSearchCrossSell$ = this.productInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.crossSellLoading = true)),
      switchMap((term) =>
        this.dataService.product
          .searchProducts(term)
          .stream$.pipe(tap(() => (this.crossSellLoading = false)))
      )
    );
  }

  saveProductRecommendations() {
    if (this.productId) {
      this.dataService
        .mutate<
          {
            updateCrossSellingProducts: boolean;
            updateUpSellingProducts: boolean;
          },
          { productId: ID; crossSellIds: ID[]; upSellIds: ID[] }
        >(
          parse(
            `mutation updateRecommendations($productId: ID!, $crossSellIds: [ID!]!, $upSellIds: [ID!]!){
              updateCrossSellingProducts(productId: $productId, productIds: $crossSellIds)
              updateUpSellingProducts(productId: $productId, productIds: $upSellIds)
            }`
          ),
          {
            productId: this.productId,
            crossSellIds: this.crossSell.map((r) => r.productId),
            upSellIds: this.upSell.map((r) => r.productId),
          }
        )
        .toPromise()
        .then(() =>
          notify({
            message: "Product recommendations updated successfully",
            type: "success",
          })
        )
        .catch((e) => {
          notify({
            message:
              "Product recommendations couldn't be updated. Check the console.",
            type: "error",
          });
          console.error(e);
        });
    }
  }
}

@NgModule({
  imports: [SharedModule],
  declarations: [ProductRecommendationsControl],
  providers: [
    registerCustomFieldComponent(
      "Product",
      "productRecommendationsEnabled",
      ProductRecommendationsControl
    ),
  ],
})
export class ProductRecommendationsInputModule {}

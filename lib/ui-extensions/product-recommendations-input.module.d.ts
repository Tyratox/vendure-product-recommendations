import { OnInit, OnDestroy } from "@angular/core";
import { ID, LanguageCode } from "@vendure/core";
import { Observable, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { CustomFieldControl, CustomFieldConfigType, DataService } from "@vendure/admin-ui/core";
import { ActivatedRoute } from "@angular/router";
declare type ProductSearch = {
    search: {
        items: {
            productId: ID;
            productName: string;
        }[];
    };
};
export declare class ProductRecommendationsControl implements CustomFieldControl, OnInit, OnDestroy {
    private route;
    private dataService;
    productId: ID | null;
    languageCode$: Observable<LanguageCode>;
    customFieldConfig: CustomFieldConfigType;
    formControl: FormControl;
    crossSell: {
        productId: ID;
        productName: string;
    }[];
    upSell: {
        productId: ID;
        productName: string;
    }[];
    productSearchUpSell$: Observable<ProductSearch>;
    productSearchCrossSell$: Observable<ProductSearch>;
    upSellLoading: boolean;
    crossSellLoading: boolean;
    productInput$: Subject<string>;
    protected destroy$: Subject<void>;
    constructor(route: ActivatedRoute, dataService: DataService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    searchProducts(): void;
    saveProductRecommendations(): void;
}
export declare class ProductRecommendationsInputModule {
}
export {};

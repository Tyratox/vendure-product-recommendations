import { DeepPartial } from "@vendure/common/lib/shared-types";
import { VendureEntity, Product } from "@vendure/core";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";

export enum RecommendationType {
  CROSSSELL = "CROSSSELL",
  UPSELL = "UPSELL",
}

@Entity()
export class ProductRecommendation extends VendureEntity {
  constructor(input?: DeepPartial<ProductRecommendation>) {
    super(input);
  }

  @ManyToOne((type) => Product, {
    onDelete: "CASCADE",
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  product: Product;

  @ManyToOne((type) => Product, {
    onDelete: "CASCADE",
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  recommendation: Product;

  @Column({
    type: "enum",
    enum: RecommendationType,
  })
  type: RecommendationType;
}

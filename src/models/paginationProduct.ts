import { Product } from "./Product";

export interface PaginationProductResponse {
  products: Product[];
  quantityPage: number;
}
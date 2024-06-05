import { Product } from "./products";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidCartItemRequestBody(value: any): value is CartItem {
  if (
    value === null ||
    typeof value !== "object" ||
    typeof value.productId !== "number" ||
    typeof value.quantity !== "number"
  ) {
    return false;
  }
  return true;
}

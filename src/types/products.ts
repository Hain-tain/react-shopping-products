import { Category } from "../constants/category";

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: Category;
}

import { CATEGORY_LIST, Category } from "../constants/category";

import { ERROR_MESSAGE } from "../constants/message";
import { PRODUCTS_ENDPOINT } from "./endPoint";
import { Sort } from "../constants/sort";
import { fetchWithToken } from "./fetchWithToken";

interface GetProductsParams {
  page: number;
  size: number;
  category: Category;
  sort: Sort;
}

export async function getProducts({
  page,
  size,
  category,
  sort,
}: GetProductsParams) {
  const params = new URLSearchParams();
  params.append("page", encodeURIComponent(page));
  params.append("size", encodeURIComponent(size));

  if (category !== CATEGORY_LIST[0]) {
    params.append("category", encodeURIComponent(category));
  }

  params.append("sort", `price,${encodeURIComponent(sort)}`);
  params.append("sort", "id,asc");

  const url = `${PRODUCTS_ENDPOINT}?${params.toString()}`;

  const data = await fetchWithToken({
    url,
    errorMessage: ERROR_MESSAGE.getProducts,
  });

  return data;
}

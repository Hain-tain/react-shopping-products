import { CATEGORY_LIST, Category } from "../constants/category";
import {
  FIRST_PAGE,
  GAP_WITH_FIRST_PAGE,
  SIZE_OF_FIRST_PAGE,
  SIZE_PER_PAGE,
} from "../constants/pagination";
import { SORT_LIST, Sort } from "../constants/sort";
import { useCallback, useEffect, useState } from "react";

import { Product } from "../types/products";
import { getProducts } from "../api/products";
import usePagination from "./usePagination";

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [category, setCategory] = useState(CATEGORY_LIST[0]);
  const [sort, setSort] = useState(SORT_LIST[0]);

  const { page, fetchNextPage, resetPage, setIsLastPage } = usePagination({
    firstPage: FIRST_PAGE,
    gapWithFirstPage: GAP_WITH_FIRST_PAGE,
  });

  useEffect(() => {
    if (isLoading || error) return;
    const size = page === FIRST_PAGE ? SIZE_OF_FIRST_PAGE : SIZE_PER_PAGE;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { content, last } = await getProducts({
          page,
          size,
          category,
          sort,
        });

        setProducts((prevProducts) => [...prevProducts, ...content]);
        setIsLastPage(last);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page, sort, category]);

  const handleCategoryChange = useCallback(
    (newCategory: Category) => {
      if (newCategory !== category) {
        setProducts([]);
        resetPage();
        setCategory(newCategory);
      }
    },
    [category, resetPage]
  );

  const handleSortChange = useCallback(
    (newSort: Sort) => {
      if (newSort !== sort) {
        setProducts([]);
        resetPage();
        setSort(newSort);
      }
    },
    [sort, resetPage]
  );

  return {
    products,
    page,
    isLoading,
    error,
    fetchNextPage,
    handleCategoryChange,
    handleSortChange,
  };
};

export default useProducts;

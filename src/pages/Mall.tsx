import { CATEGORY, CATEGORY_LIST } from "../constants/category";
import { SORT, SORT_LIST } from "../constants/sort";

import Dropdown from "../components/Dropdown";
import { Global } from "@emotion/react";
import Header from "../components/Header";
import InfiniteScrollComponent from "../components/InfiniteScrollComponent";
import MainTitle from "../components/MainTitle";
import ProductCard from "../components/product/ProductCard";
import { ToastContext } from "../components/Toasts/ToastProvider";
import { baseStyle } from "../style/baseStyle";
import styled from "@emotion/styled";
import useCustomContext from "../hooks/useCustomContext";
import { useEffect } from "react";
import useManageCartItem from "../hooks/useManageCartItem";
import useProducts from "../hooks/useProducts";

const S = {
  MainMall: styled.div`
    padding: 36px 24px;

    display: flex;
    flex-direction: column;
    gap: 24px;
  `,
  Toolbar: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  ProductList: styled.div`
    display: grid;
    grid-template-columns: repeat(2, 183px);
    gap: 16px;
  `,
};

const Mall = () => {
  const {
    products,
    isLoading: isProductLoading,
    error: productError,
    fetchNextPage,
    handleCategoryChange,
    handleSortChange,
  } = useProducts();

  const {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    isItemInCart,
    isLoading: isToggleCartItemLoading,
    error: toggleCartItemError,
  } = useManageCartItem();

  const { failAlert } = useCustomContext(ToastContext);

  useEffect(() => {
    if (toggleCartItemError && toggleCartItemError instanceof Error) {
      failAlert(toggleCartItemError.message);
    }
  }, [toggleCartItemError]);

  useEffect(() => {
    if (productError && productError instanceof Error) {
      failAlert(productError.message);
    }
  }, [productError]);

  return (
    <>
      <Global styles={baseStyle} />
      <Header itemCount={cartItems.length} />
      <S.MainMall>
        <MainTitle>피터의 쇼핑몰</MainTitle>
        <S.Toolbar>
          <Dropdown
            options={CATEGORY_LIST}
            engToKor={CATEGORY}
            handleChange={handleCategoryChange}
          />
          <Dropdown
            options={SORT_LIST}
            engToKor={SORT}
            handleChange={handleSortChange}
          />
        </S.Toolbar>
        <S.ProductList>
          <InfiniteScrollComponent
            isLoading={isProductLoading}
            error={productError}
            fetchNextPage={fetchNextPage}
          >
            {products.map((product, index) => (
              <ProductCard
                key={`${index}${product.id}`}
                product={product}
                cartManager={{
                  addItemToCart,
                  removeItemFromCart,
                  isItemInCart,
                  isLoading: isToggleCartItemLoading,
                }}
              />
            ))}
          </InfiniteScrollComponent>
        </S.ProductList>
      </S.MainMall>
    </>
  );
};

export default Mall;

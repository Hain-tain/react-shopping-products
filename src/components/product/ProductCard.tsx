import { CartManager } from "../../hooks/useManageCartItem";
import { Product } from "../../types/products";
import { PropsWithChildren } from "react";
import ToggleItemButton from "./ToggleItemButton";
import styled from "@emotion/styled";

const S = {
  ProductCard: styled.div`
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 182px;
    font-family: Arial, sans-serif;
    overflow: hidden;
  `,
  ProductImage: styled.img`
    width: 100%;
    height: 112px;
    object-fit: cover;
  `,
  ProductInfo: styled.div`
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  ProductName: styled.div`
    font-size: 14px;
    font-weight: 700;
  `,
  Price: styled.div`
    font-size: 12px;
    font-weight: 500;
  `,
};

interface ProductCardProps extends PropsWithChildren {
  product: Product;
  cartManager: CartManager;
}

const ProductCard = ({ product, cartManager }: ProductCardProps) => {
  return (
    <S.ProductCard>
      <S.ProductImage src={product.imageUrl} alt={product.name} />
      <S.ProductInfo>
        <S.ProductName>{product.name}</S.ProductName>
        <S.Price>{`${product.price.toLocaleString("ko-KR")}원`}</S.Price>
        <ToggleItemButton id={product.id} cartManager={cartManager} />
      </S.ProductInfo>
    </S.ProductCard>
  );
};

export default ProductCard;

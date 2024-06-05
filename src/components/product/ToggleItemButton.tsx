import { useEffect, useState } from "react";

import AddToCart from "../icons/AddToCart";
import COLOR_PALETTE from "../../style/colorPalette";
import { CartManager } from "../../hooks/useManageCartItem";
import DeleteFromCart from "../icons/DeleteFromCart";
import LoadingDots from "../LoadingDots";
import styled from "@emotion/styled";

const S = {
  ToggleItemButton: styled.button<{ isSelected: boolean }>`
    width: 60px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    background-color: ${({ isSelected }) =>
      isSelected ? COLOR_PALETTE.lightGrey : COLOR_PALETTE.black};
    color: ${({ isSelected }) =>
      isSelected ? COLOR_PALETTE.black : COLOR_PALETTE.white};
    padding: 8px;
    margin: 4px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    align-self: flex-end;
    &:hover {
      opacity: 0.8;
    }
  `,
};

interface ToggleItemButtonProps {
  id: number;
  cartManager: CartManager;
}

const ToggleItemButton = ({ id, cartManager }: ToggleItemButtonProps) => {
  const { addItemToCart, removeItemFromCart, isItemInCart } = cartManager;
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setSelected] = useState(isItemInCart(id));

  useEffect(() => {
    setSelected(isItemInCart(id));
  }, [isItemInCart, id]);

  const handleClick = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setSelected((prev) => !prev);

      if (isSelected) {
        await removeItemFromCart(id);
      }
      if (!isSelected) {
        await addItemToCart(id);
      }
    } catch (error) {
      setSelected((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.ToggleItemButton key={id} onClick={handleClick} isSelected={isSelected}>
      {isLoading ? (
        <LoadingDots type={isSelected ? "black" : "white"} />
      ) : isSelected ? (
        <>
          <DeleteFromCart />
          빼기
        </>
      ) : (
        <>
          <AddToCart />
          담기
        </>
      )}
    </S.ToggleItemButton>
  );
};

export default ToggleItemButton;

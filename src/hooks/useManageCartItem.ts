import { deleteCartItems, getCartItems, postCartItems } from "../api/cartItems";
import { useCallback, useEffect, useState } from "react";

import { CartItem } from "../types/cartItems";

export interface CartManager {
  addItemToCart: (productId: number) => Promise<void>;
  removeItemFromCart: (productId: number) => Promise<void>;
  isItemInCart: (id: number) => boolean;
  isLoading: boolean;
}

const useManageCartItem = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchCartItems = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const prevData = await getCartItems();
      const size = prevData.totalElements;
      const data = await getCartItems(size);
      setCartItems(data.content);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const addItemToCart = useCallback(
    async (productId: number) => {
      if (isLoading) return;
      try {
        setIsLoading(true);
        await postCartItems({ productId, quantity: 1 });
        await fetchCartItems();
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const removeItemFromCart = useCallback(
    async (productId: number) => {
      if (isLoading) return;
      try {
        setIsLoading(true);

        const targetCartItem = cartItems.find(
          (item) => item.product.id === productId
        );

        if (!targetCartItem) {
          throw new Error("장바구니에 없는 상품입니다.");
        }

        const targetCartItemId = targetCartItem.id;

        await deleteCartItems(targetCartItemId);
        setCartItems((cartItems) => {
          const newCartItems = cartItems.filter(
            (cartItem) => cartItem.id !== targetCartItemId
          );
          return newCartItems;
        });
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, cartItems]
  );

  const isItemInCart = useCallback(
    (id: number) => !!cartItems.find((item) => item.product.id === id),
    [cartItems]
  );

  return {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    isItemInCart,
    isLoading,
    error,
  };
};

export default useManageCartItem;

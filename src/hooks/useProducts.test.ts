import {
  FIRST_PAGE,
  GAP_WITH_FIRST_PAGE,
  MOCK_PRODUCTS_LAST_PAGE,
  MOCK_PRODUCTS_TOTAL_SIZE,
  SIZE_OF_FIRST_PAGE,
  SIZE_PER_PAGE,
} from "../constants/pagination";
import { HttpResponse, http } from "msw";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PRODUCTS_ENDPOINT } from "../api/endPoint";
import { server } from "../mocks/server";
import useProducts from "./useProducts";

describe("useProduct 훅 테스트", () => {
  describe("상품 목록 조회", () => {
    it("상품 목록을 조회한다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products).toHaveLength(SIZE_OF_FIRST_PAGE);
      });
    });

    it("상품 목록을 조회되기 이전 로딩 값은 true값이다", async () => {
      const { result } = renderHook(() => useProducts());

      expect(result.current.isLoading).toBe(true);
    });

    it("상품 목록을 조회된 이후 로딩 값은 false값이다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("상품 목록을 조회 중 에러가 발생하면 error값이 반환된다", async () => {
      server.use(
        http.get(PRODUCTS_ENDPOINT, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useProducts());
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("페이지네이션", () => {
    it("초기 값은 상품 20개를 불러온다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products).toHaveLength(SIZE_OF_FIRST_PAGE);
        expect(result.current.page).toBe(FIRST_PAGE);
      });
    });

    it("다음 페이지는 상품 4개를 불러온다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products).toHaveLength(SIZE_OF_FIRST_PAGE);
        expect(result.current.page).toBe(FIRST_PAGE);
      });

      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.products.length).toBe(
          SIZE_OF_FIRST_PAGE + SIZE_PER_PAGE
        );
        expect(result.current.page).toBe(FIRST_PAGE + GAP_WITH_FIRST_PAGE);
      });
    });

    it("페이지네이션으로 추가 데이터를 발생할 때 로딩 상태를 표시한다", async () => {
      const { result } = renderHook(() => useProducts());

      act(() => {
        result.current.fetchNextPage();
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("마지막 페이지인 경우 데이터를 불러오지 않는다.", async () => {
      const { result } = renderHook(() => useProducts());

      const expectedInitProductsCount = SIZE_OF_FIRST_PAGE;

      await waitFor(() => {
        expect(result.current.products).toHaveLength(expectedInitProductsCount);
      });

      for (
        let page = FIRST_PAGE + GAP_WITH_FIRST_PAGE;
        page <= MOCK_PRODUCTS_LAST_PAGE;
        page += 1
      ) {
        act(() => {
          result.current.fetchNextPage();
        });

        const expectedProductsCount =
          expectedInitProductsCount +
          (page - GAP_WITH_FIRST_PAGE) * SIZE_PER_PAGE;

        await waitFor(() => {
          expect(result.current.page).toBe(page);
          expect(result.current.products).toHaveLength(expectedProductsCount);
        });
      }

      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.page).toBe(MOCK_PRODUCTS_LAST_PAGE);
        expect(result.current.products).toHaveLength(MOCK_PRODUCTS_TOTAL_SIZE);
      });
    });
  });
});

import { PropsWithChildren, useEffect, useRef } from "react";

import LoadingDots from "./LoadingDots";
import styled from "@emotion/styled";

interface InfiniteScrollComponentProps {
  isLoading: boolean;
  error: unknown;
  fetchNextPage: () => void;
}

const S = {
  FallbackContainer: styled.div`
    width: calc(183px * 2 + 16px);
    margin: 16px 0;
  `,
};

const InfiniteScrollComponent = ({
  isLoading,
  error,
  fetchNextPage,
  children,
}: PropsWithChildren<InfiniteScrollComponentProps>) => {
  const loaderRef = useRef(null);
  const errorMessage =
    error instanceof Error
      ? error.message
      : "알 수 없는 에러가 발생하였습니다.";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, fetchNextPage]);

  return (
    <>
      {children}
      <S.FallbackContainer>
        {error! && <div>{errorMessage}</div>}
        <div ref={loaderRef}>{isLoading && <LoadingDots />}</div>
      </S.FallbackContainer>
    </>
  );
};

export default InfiniteScrollComponent;

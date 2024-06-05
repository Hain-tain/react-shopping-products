import { useCallback, useState } from "react";

interface Props {
  firstPage: number;
  gapWithFirstPage: number;
}

const usePagination = ({ firstPage, gapWithFirstPage }: Props) => {
  const [page, setPage] = useState(firstPage);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchNextPage = useCallback(() => {
    if (isLastPage) {
      return;
    }

    if (page === firstPage) {
      setPage((page) => page + gapWithFirstPage);
      return;
    }

    setPage((page) => page + 1);
  }, [firstPage, gapWithFirstPage, isLastPage, page]);

  const resetPage = useCallback(() => {
    setPage(firstPage);
  }, [firstPage]);

  return { page, fetchNextPage, resetPage, setIsLastPage };
};

export default usePagination;

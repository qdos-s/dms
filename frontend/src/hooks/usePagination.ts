import { useState } from "react";

import { FileProps } from "../types";

const usePagination = (items: FileProps[], pageLimit: number) => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageCount =
    items.length === 0 ? 1 : Math.ceil(items.length / pageLimit);

  const changePage = (pageN: number) => {
    setPageNumber(pageN);
  };

  const pageData = () => {
    const start = (pageNumber - 1) * pageLimit;
    const end = start + pageLimit;
    if (items.length && items.length <= start) {
      setPageNumber(pageNumber - 1);
    }
    return items.slice(start, end);
  };

  const nextPage = () => {
    setPageNumber(Math.min(pageNumber + 1, pageCount));
  };

  const previousPage = () => {
    setPageNumber(Math.max(pageNumber - 1, 1));
  };

  return {
    pageNumber,
    pageCount,
    changePage,
    pageData,
    nextPage,
    previousPage,
    setPageNumber,
  };
};

export default usePagination;

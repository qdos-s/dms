import { FC, useEffect } from "react";

import usePagination from "../hooks/usePagination.ts";
import styles from "../styles/Pagination.module.css";
import { FileProps } from "../types";

type PaginationPropTypes = {
  items: FileProps[];
  pageLimit: number;
  setPageItems: (pageData: FileProps[]) => void;
};

const Pagination: FC<PaginationPropTypes> = ({
  items,
  pageLimit,
  setPageItems,
}) => {
  const {
    pageNumber,
    pageCount,
    changePage,
    pageData,
    previousPage,
    nextPage,
  } = usePagination(items, pageLimit);

  useEffect(() => {
    setPageItems(pageData());
  }, [pageNumber, items]);

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={previousPage}
        className={styles.button}
        disabled={pageNumber === 1}
      >
        &#8592;
      </button>
      <input
        value={pageNumber}
        onChange={(e) => {
          changePage(e.target.valueAsNumber);
        }}
        type="number"
        min={1}
        max={pageCount}
        className={styles.input}
        onKeyDown={(e) => e.preventDefault()}
      />
      <button
        className={styles.button}
        onClick={nextPage}
        disabled={pageNumber === pageCount}
      >
        &#8594;
      </button>
    </div>
  );
};

export default Pagination;

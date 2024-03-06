import { FC } from "react";

import styles from "../styles/Pagination.module.css";

type PaginationPropTypes = {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  currentPage: number;
  isNextRecord: boolean;
};

const Pagination: FC<PaginationPropTypes> = ({
  handleNextPage,
  handlePrevPage,
  currentPage,
  isNextRecord,
}) => {
  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={handlePrevPage}
        className={styles.button}
        disabled={currentPage === 1}
      >
        &#8592;
      </button>
      <input
        value={currentPage}
        onChange={(e) => {
          if (currentPage < e.target.valueAsNumber) {
            handleNextPage();
          } else {
            handlePrevPage();
          }
        }}
        type="number"
        min={1}
        className={styles.input}
        onKeyDown={(e) => e.preventDefault()}
      />
      <button
        className={styles.button}
        onClick={handleNextPage}
        disabled={!isNextRecord}
      >
        &#8594;
      </button>
    </div>
  );
};

export default Pagination;

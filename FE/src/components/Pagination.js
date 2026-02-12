import styles from "../css/Pagination.module.css";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  // Tạo danh sách số trang
  const getPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`${styles.navBtn} ${styles.arrowBtn}`}
      >
        ‹
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${styles.pageBtn} ${page === num ? styles.active : ""}`}
        >
          {num}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`${styles.navBtn} ${styles.arrowBtn}`}
      >
        ›
      </button>
    </div>
  );
}

export default Pagination;

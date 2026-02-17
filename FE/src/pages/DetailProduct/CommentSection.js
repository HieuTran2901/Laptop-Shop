import styles from "../../css/DetailProduct/CommentSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

function CommentSection({ averageRating, comments, setComments }) {
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  return (
    <section className={styles.commentSection}>
      <h2>Đánh giá & Bình luận</h2>

      {/* Rating Summary */}
      <div className={styles.ratingSummary}>
        <div className={styles.ratingOverview}>
          <div className={styles.averageScore}>
            <h3>{averageRating}</h3>
            <div className={styles.averageStars}>
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={i < Math.round(averageRating) ? solidStar : regularStar}
                  className={styles.starLarge}
                />
              ))}
            </div>
            <span className={styles.ratingLabel}>
              {averageRating >= 4.5
                ? "Xuất sắc"
                : averageRating >= 4
                  ? "Rất tốt"
                  : "Tốt"}
            </span>
          </div>
          <div className={styles.totalReviews}>
            <p>{comments.length} đánh giá từ khách hàng</p>
          </div>
        </div>

        <div className={styles.ratingBreakdown}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = comments.filter((c) => c.rating === star).length;
            const percentage = comments.length
              ? (count / comments.length) * 100
              : 0;
            return (
              <div key={star} className={styles.ratingBar}>
                <span className={styles.barLabel}>
                  {star}{" "}
                  <FontAwesomeIcon
                    icon={solidStar}
                    className={styles.starSmall}
                  />
                </span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className={styles.barCount}>({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comment Form */}
      <div className={styles.commentForm}>
        <div className={styles.formHeader}>
          <img
            src="https://via.placeholder.com/48?text=User"
            alt="Avatar"
            className={styles.formAvatar}
          />
          <span>Chia sẻ đánh giá của bạn</span>
        </div>

        {/* Interactive Star Rating */}
        <div className={styles.starRatingInput}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={newRating >= star ? solidStar : regularStar}
              className={`${styles.starInput} ${newRating >= star ? styles.selected : ""}`}
              onClick={() => setNewRating(star)}
            />
          ))}
        </div>

        <textarea
          placeholder="Bạn nghĩ gì về sản phẩm này? (tối thiểu 10 ký tự)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          minLength={10}
          rows={4}
        />

        <button
          className={styles.submitButton}
          onClick={() => {
            if (newComment.trim().length < 10) {
              alert("Đánh giá cần ít nhất 10 ký tự.");
              return;
            }
            const newCmt = {
              id: Date.now(),
              name: "Khách hàng",
              rating: newRating,
              content: newComment.trim(),
              date: new Date().toLocaleDateString("vi-VN"),
            };
            setComments([newCmt, ...comments]);
            setNewComment("");
            setNewRating(5);
            alert("Cảm ơn bạn đã gửi đánh giá!");
          }}
          disabled={newComment.trim().length < 10}
        >
          Gửi đánh giá
        </button>
      </div>

      {/* Comment List */}
      <div className={styles.commentList}>
        {comments.map((c) => (
          <div key={c.id} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <img
                src="https://via.placeholder.com/40?text=User"
                alt="Avatar"
                className={styles.commentAvatar}
              />
              <div className={styles.commentInfo}>
                <strong>{c.name}</strong>
                <div className={styles.commentStars}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={i < c.rating ? solidStar : regularStar}
                      className={styles.star}
                    />
                  ))}
                </div>
              </div>
              <small className={styles.commentDate}>{c.date}</small>
            </div>
            <p className={styles.commentContent}>{c.content}</p>
            <div className={styles.commentActions}>
              <button className={styles.replyBtn}>Trả lời</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CommentSection;

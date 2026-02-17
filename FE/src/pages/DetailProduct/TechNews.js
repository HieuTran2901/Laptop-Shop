import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import styles from "../../css/DetailProduct/TechNews.module.css";
import { techNews } from "../../components/Data/detailProductcomp"; // giả sử mảng này có 4–6 item

function TechNews() {
  // Lấy 4 tin mới nhất hoặc liên quan nhất (có thể filter theo date nếu data có)
  const displayedNews = techNews.slice(0, 5);

  return (
    <section className={styles.tabSection}>
      <h2>Tin tức công nghệ 2026</h2>
      <p className={styles.intro}>
        Cập nhật nhanh về AI PC, Copilot+ và Surface Laptop (tháng 2/2026).
      </p>

      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        slidesPerView="auto"
        spaceBetween={16}
        className={styles.newsSwiper}
      >
        {displayedNews.map((news, idx) => (
          <SwiperSlide key={idx} className={styles.newsSlide}>
            <div className={styles.newsCard}>
              <img
                src={
                  news.image ||
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                } // placeholder AI/tech, thay bằng ảnh thật
                alt={news.title}
                className={styles.newsImage}
                loading="lazy"
              />
              <div className={styles.newsContent}>
                <h3 className={styles.newsTitle}>{news.title}</h3>
                <p className={styles.newsSummary}>{news.summary}</p>
                <div className={styles.newsMeta}>
                  <span>
                    {news.source} • {news.date}
                  </span>
                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.newsLink}
                  >
                    →
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default TechNews;

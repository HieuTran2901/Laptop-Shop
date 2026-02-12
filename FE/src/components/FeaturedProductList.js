import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import "../css/FeaturedProduct.css";

const FeaturedProductList = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await getProducts();
      // Assuming the API returns a list of products, we filter for featured ones
      const featured = res.data.items.filter((product) => product.isFeatured);
      setFeaturedProducts(featured);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="featured-section">
      {/* Caption */}
      <div className="featured-header">
        <h2>SẢN PHẨM NỔI BẬT</h2>
        <p>
          Những mẫu laptop bán chạy, cấu hình mạnh – giá tốt – bảo hành chính
          hãng
        </p>
      </div>

      {/* Product Grid */}
      <div className="featured-grid">
        {featuredProducts.map((p) => (
          <div key={p.id} className="featured-card">
            {/* Ribbon SALE */}
            <div className="ribbon">
              <span>-{p.discount}%</span>
            </div>

            {/* Image */}
            <div className="featured-image-wrap">
              <img src={p.imageUrl} alt={p.name} />
            </div>

            {/* Info */}
            <div className="featured-info">
              <h3>{p.name}</h3>
              <p className="brand">{p.brand}</p>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>({p.rating})</span>
              </div>

              <div className="price-box">
                <span className="price">${p.price}</span>
                <span className="old-price">${p.oldPrice}</span>
              </div>

              <button className="featured-btn">
                <i className="fas fa-cart-plus"></i> Mua ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProductList;

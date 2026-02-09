import React, { useEffect, useState, useRef } from "react";
import { updateProduct, getProductById } from "../services/productService";
import { uploadImages } from "../services/uploadService";
import styles from "../css/ProductForm.module.css";

function UpdateProduct({ productId, onProductUpdated }) {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    oldPrice: "",
    description: "",
    specs: "",
    images: [],
    category: "",
  });

  const [imageFiles, setImageFiles] = useState([]); // ảnh mới
  const fileInputRef = useRef(null);

  // 🔹 Load product
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(productId);
      setProduct(res.data);
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ❌ Xoá ảnh cũ
  const removeOldImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ❌ Xoá ảnh mới
  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // upload ảnh mới
      let uploadedUrls = [];
      if (imageFiles.length > 0) {
        uploadedUrls = await Promise.all(
          imageFiles.map((file) =>
            uploadImages(file).then((res) => res.data[0]),
          ),
        );
      }

      const res = await updateProduct(productId, {
        ...product,
        price: parseFloat(product.price),
        oldPrice: product.oldPrice ? parseFloat(product.oldPrice) : null,
        images: [...product.images, ...uploadedUrls], // gộp ảnh
      });

      onProductUpdated(res.data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <form className={styles.productForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Update Product</h2>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input name="name" value={product.name} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Brand</label>
          <input name="brand" value={product.brand} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Old Price</label>
          <input
            type="number"
            name="oldPrice"
            value={product.oldPrice || ""}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Description</label>
          <textarea
            name="description"
            rows={3}
            value={product.description}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Specifications</label>
          <textarea
            name="specs"
            rows={6}
            value={product.specs || ""}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Add Images</label>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className={styles.fileInput}
            onChange={(e) =>
              setImageFiles([...imageFiles, ...Array.from(e.target.files)])
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Category</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 🔹 Ảnh cũ */}
      <div className={styles.previewImages}>
        {product.images.map((url, i) => (
          <div key={i} className={styles.previewItem}>
            <img src={url} alt="" />
            <span
              className={styles.removeBtn}
              onClick={() => removeOldImage(i)}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {/* 🔹 Ảnh mới */}
      <div className={styles.previewImages}>
        {imageFiles.map((file, i) => (
          <div key={i} className={styles.previewItem}>
            <img src={URL.createObjectURL(file)} alt="" />
            <span
              className={styles.removeBtn}
              onClick={() => removeNewImage(i)}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      <button className={styles.submitBtn} type="submit">
        Update Product
      </button>
    </form>
  );
}

export default UpdateProduct;

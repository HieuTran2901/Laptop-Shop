import React, { useState, useRef } from "react";
import { createProduct } from "../services/productService";
import { uploadImages } from "../services/uploadService";
import styles from "../css/ProductForm.module.css";

function ProductForm({ onProductAdded }) {
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

  const inputFileRef = useRef(null);

  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedUrls = await Promise.all(
        imageFiles.map((file) => uploadImages(file).then((res) => res.data[0])),
      );

      const res = await createProduct({
        ...product,
        price: parseFloat(product.price),
        oldPrice: product.oldPrice ? parseFloat(product.oldPrice) : null,
        images: uploadedUrls,
      });

      onProductAdded(res.data);

      setProduct({
        name: "",
        brand: "",
        price: "",
        oldPrice: "",
        description: "",
        specs: "",
        images: [],
        category: "",
      });
      setImageFiles([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  return (
    <form className={styles.productForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Add New Product</h2>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Brand</label>
          <input
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Old Price</label>
          <input
            type="number"
            name="oldPrice"
            value={product.oldPrice}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Specifications</label>
          <textarea
            name="specs"
            value={product.specs}
            onChange={handleChange}
            rows={6}
            placeholder={`CPU: Intel Core i7-12700H
RAM: 16GB DDR5
SSD: 512GB NVMe
GPU: RTX 4060
Screen: 15.6" FHD 144Hz`}
          />
          <small>Format: Key: Value (mỗi dòng 1 thông số)</small>
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Images</label>
          <input
            type="file"
            multiple
            ref={inputFileRef}
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

      <div className={styles.previewImages}>
        {imageFiles.map((file, index) => (
          <div key={index} className={styles.previewItem}>
            <img src={URL.createObjectURL(file)} alt={`preview-${index}`} />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemoveImage(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button className={styles.submitBtn} type="submit">
        Add Product
      </button>
    </form>
  );
}

export default ProductForm;

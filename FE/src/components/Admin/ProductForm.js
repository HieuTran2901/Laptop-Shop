import React, { useState, useRef } from "react";
import { createProduct } from "../../services/productService";
import { uploadImages } from "../../services/uploadService";
import styles from "../../css/ProductForm.module.css";

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
    ram: "",
    cpu: "",
  });

  const inputFileRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
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
        ram: product.ram ? parseInt(product.ram) : null,
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
        ram: "",
        cpu: "",
        isFeatured: false,
      });

      setImageFiles([]);
      if (inputFileRef.current) inputFileRef.current.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form className={styles.productForm} onSubmit={handleSubmit}>
      <h2>Add New Product</h2>

      <div className={styles.mainGrid}>
        {/* LEFT SIDE */}
        <div className={styles.leftSection}>
          <div className={styles.grid4}>
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
              <label>Category</label>
              <input
                name="category"
                value={product.category}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>CPU</label>
              <input name="cpu" value={product.cpu} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>RAM</label>
              <select name="ram" value={product.ram} onChange={handleChange}>
                <option value="">Select</option>
                <option value="8">8GB</option>
                <option value="16">16GB</option>
                <option value="32">32GB</option>
              </select>
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

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={product.isFeatured}
                  onChange={handleChange}
                />
                Featured Product
              </label>
            </div>
          </div>

          <div className={styles.textAreaRow}>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Specifications</label>
              <textarea
                name="specs"
                value={product.specs}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightSection}>
          <label>Images</label>
          <input
            type="file"
            multiple
            ref={inputFileRef}
            onChange={(e) =>
              setImageFiles([...imageFiles, ...Array.from(e.target.files)])
            }
          />

          <div className={styles.previewImages}>
            {imageFiles.map((file, index) => (
              <div key={index} className={styles.previewItem}>
                <img src={URL.createObjectURL(file)} alt="" />
                <button type="button" onClick={() => handleRemoveImage(index)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button type="submit">Add Product</button>
      </div>
    </form>
  );
}

export default ProductForm;

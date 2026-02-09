package com.laptopshop.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private String brand;
    private Double price;
    private Double oldPrice;
    private String category;
    @ElementCollection
    @CollectionTable(
            name = "product_images",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "image_url")
    private List<String> images;

    // Thông số (Lob dùng để đánh dấu dữ liệu có kích thước lớn)
    @Lob
    private String specs;

    @Lob
    private String description;


    // Getter, Setter
    public Long getId() { return id; }

    public String getCode() {return  code; }

    public void setCode(String code) {
        this.code = code;
    }

    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public Double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(Double oldPrice) {
        this.oldPrice = oldPrice;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSpecs() { return specs; }
    public void setSpecs(String specs) { this.specs = specs; }
}
package com.laptopshop.backend.controller;

import com.laptopshop.backend.model.Product;
import com.laptopshop.backend.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        Product existing = productService.getById(id);
        if (existing == null) return null; // hoặc ném exception
        // Cập nhật các trường
        existing.setName(product.getName());
        existing.setBrand(product.getBrand());
        existing.setPrice(product.getPrice());
        existing.setDescription(product.getDescription());
        existing.setImages(product.getImages());
        existing.setCategory(product.getCategory());
        existing.setOldPrice(product.getOldPrice());
        existing.setCode(product.getCode()); // nếu muốn update code
        existing.setSpecs(product.getSpecs());

        return productService.save(existing);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}

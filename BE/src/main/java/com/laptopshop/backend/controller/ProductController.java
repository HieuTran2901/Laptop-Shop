package com.laptopshop.backend.controller;

import com.laptopshop.backend.model.Product;
import com.laptopshop.backend.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

//    @GetMapping
//    public List<Product> getAll() {
//        return productService.getAll();
//    }

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) List<String> price,
            @RequestParam(required = false) List<String> cpu,
            @RequestParam(required = false) List<String> ram,
            @RequestParam(required = false) String sort
    ) {
        Page<Product> productPage = productService.getProducts(page - 1, size, brand, price, cpu, ram, sort);

        Map<String, Object> response = new HashMap<>();
        response.put("items", productPage.getContent());
        response.put("page", page);
        response.put("size", size);
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPage", productPage.getTotalPages());

        return ResponseEntity.ok(response);

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
        existing.setCpu(product.getCpu());
        existing.setRam(product.getRam());

        return productService.save(existing);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}

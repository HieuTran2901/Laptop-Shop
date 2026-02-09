package com.laptopshop.backend.Service;

import com.laptopshop.backend.model.Product;
import com.laptopshop.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.laptopshop.backend.util.SpecParser;

import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product save(Product product) {
        if(product.getId() == null) {
            String code = generateProductCode();
            product.setCode(code);
        }

        // Chuẩn hóa sang unix tránh lỗi
        if (product.getSpecs() != null) {
//            String normalizedSpecs = product.getSpecs()
//                    .replace("\r\n", "\n") //Window -> Unix
//                    .trim();
            String normalizedSpecs = SpecParser.normalize(product.getSpecs());
            product.setSpecs(normalizedSpecs);
        }
        return productRepository.save(product);
    }

    public Map<String, String> getParsedSpecs(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow();

        return SpecParser.parse(product.getSpecs());
    }

    private String generateProductCode() {
        // Lấy ngày hiện tại
        String datePart = new java.text.SimpleDateFormat("yyyyMMdd").format(new java.util.Date());

        // Lấy tổng số sản phẩm hiện có để tạo số thứ tự
        long count = productRepository.count() + 1;
        String numberPart = String.format("%03d", count); // Ví dụ: 001, 002, ...

        return String.join("_", "Lap", datePart, numberPart); // Kết quả: LAP_20251111_001
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}

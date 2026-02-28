package com.laptopshop.backend.Service;

import com.laptopshop.backend.model.Product;
import com.laptopshop.backend.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.laptopshop.backend.util.SpecParser;

import java.util.ArrayList;
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

    public Page<Product> getProducts(
            int page,
            int size,
            List<String> brand,
            List<String> price,
            List<String> cpu,
            List<String> ram,
            String sort
    ) {
//        Pageable pageable =
//                PageRequest.of(page, size, Sort.by("id").descending());
        Pageable pageable;
        if(sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(",");

            String field = parts[0];
            Sort.Direction direction =
                    parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                    ? Sort.Direction.ASC : Sort.Direction.DESC;
            pageable = PageRequest.of(page, size, Sort.by(direction, field));
        } else {
            pageable = PageRequest.of(page, size, Sort.by("id").descending());
        }

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (brand != null && !brand.isEmpty()) {
                predicates.add(root.get("brand").in(brand));
            }

            // ⚠ Nếu price trong DB là number
            if (price != null && !price.isEmpty()) {
                for (String p : price) {
                    if (p.equals("Dưới 10 triệu")) {
                        predicates.add(cb.lessThan(root.get("price"), 10000000));
                    }
                    if (p.equals("10 - 20 triệu")) {
                        predicates.add(cb.between(root.get("price"), 10000000, 20000000));
                    }
                }
            }

            // 🔹 CPU (String)
            if (cpu != null && !cpu.isEmpty()) {
                predicates.add(root.get("cpu").in(cpu));
            }

            // 🔹 RAM (Integer)
            if (ram != null && !ram.isEmpty()) {
                List<Integer> ramValues = ram.stream()
                        .map(Integer::parseInt)
                        .toList();

                predicates.add(root.get("ram").in(ramValues));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}

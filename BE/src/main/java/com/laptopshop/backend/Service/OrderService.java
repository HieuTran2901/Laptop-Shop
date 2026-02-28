package com.laptopshop.backend.Service;

import com.laptopshop.backend.model.*;
import com.laptopshop.backend.repository.CartRepository;
import com.laptopshop.backend.repository.OrderRepository;
import com.laptopshop.backend.repository.ProductRepository;
import com.laptopshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    // Create order
    public Order createOrder(Order request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        request.setUser(user);
        request.setOrderCode(UUID.randomUUID().toString());
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());

        CalculateTotal(request);

//        if (request.getItems() != null) {
//            request.getItems().forEach(item -> {
//
//                // set quan hệ 2 chiều
//                item.setOrder(request);
//
//                // snapshot dữ liệu
//                if (item.getProduct() != null) {
//                    item.setProductName(item.getProduct().getName());
//                    item.setPrice(item.getProduct().getPrice());
//                }
//            });
//        }

        //Delete cart after create order
        cart.getItems().clear();
        cartRepository.save(cart);

        return orderRepository.save(request);
    }

    //Calculate Total
    public void CalculateTotal(Order request) {
        double total = 0;

        for (OrderItem item : request.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            item.setOrder(request);
            item.setProduct(product);
            item.setPrice(product.getPrice());
            item.setProductName(product.getName());

            total += product.getPrice() * item.getQuantity();
        }
        request.setTotalAmount(total);
    }

    // Pagination
    public Page<Order> GetOrders(Long userId,int page, int size) {
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdAt").descending());

        return orderRepository.findByUserId(userId, pageable);
    }

    // Get by orderCode
    public Order getOrderByCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Get all
    public Page<Order> getAllOrders(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("createdAt").descending()
        );

        return orderRepository.findAll(sortedPageable);
    }

    // Get by user
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void confirmOrder(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("OrderCode not found"));

        if(!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Just confirm pending order");
        }

        order.setStatus("CONFIRMED");

        orderRepository.save(order);
    }

    // cancelled order
    public void cancelOrder(String orderCode) {
        Order order = getOrderByCode(orderCode);

        if("PAID".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel paid order");
        }

        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }
}

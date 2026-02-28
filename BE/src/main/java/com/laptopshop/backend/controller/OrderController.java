package com.laptopshop.backend.controller;

import com.laptopshop.backend.Service.OrderService;
import com.laptopshop.backend.model.Order;
import com.laptopshop.backend.model.User;
import com.laptopshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    // Create order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(order);
    }

    // Get by orderCode
    @GetMapping("/{orderCode}")
    public ResponseEntity<Order> getOrderDetail (@PathVariable String orderCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderService.getOrderByCode(orderCode);

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return ResponseEntity.ok(order);
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow();

        Page<Order> OrderPage = orderService.GetOrders(user.getId(),page, size);

        return ResponseEntity.ok(OrderPage);
    }

    // Cancel order
    @PutMapping("/{orderCode}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderCode) {
        orderService.cancelOrder(orderCode);
        return ResponseEntity.ok("Order cancelled");
    }

    @PutMapping("/{orderCode}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> confirmOrder(@PathVariable String orderCode) {
        orderService.confirmOrder(orderCode);
        return ResponseEntity.ok("Order confirmed");
    }
}

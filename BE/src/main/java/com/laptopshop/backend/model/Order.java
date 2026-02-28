package com.laptopshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer info
    private String customerName;
    private String phone;
    private String address;
    private String email;
    private String note;

    // Payment
    private Double totalAmount;

    @Column(unique = true)
    private String orderCode; // use for Momo

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // required user
    private User user;

    private String momoTransactionId;

    private String status;  //PENDING, PAID, CANCELLED
    private String paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;
}

package com.laptopshop.backend.repository;

import com.laptopshop.backend.model.Cart;
import com.laptopshop.backend.model.CartItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Page<CartItem> findByCart(Cart cart, Pageable pageable);
}

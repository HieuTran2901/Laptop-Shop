package com.laptopshop.backend.controller;

import com.laptopshop.backend.Service.CartService;
import com.laptopshop.backend.Service.UserService;
import com.laptopshop.backend.model.Cart;
import com.laptopshop.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    public Cart getCart(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return cartService.getCartByUser(user);
    }

    @PostMapping("/add")
    public Cart addToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {
        User user = userService.getCurrentUser(authentication);
        return cartService.addToCart(user, productId, quantity);
    }

    @PutMapping("/update")
    public Cart updateQuantity(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {
        User user = userService.getCurrentUser(authentication);
        return cartService.updateQuantity(user, productId, quantity);
    }

    @DeleteMapping("/remove")
    public Cart removeItem(
            Authentication authentication,
            @RequestParam Long productId
    ) {
        User user = userService.getCurrentUser(authentication);
        return cartService.removeItem(user, productId);
    }
}

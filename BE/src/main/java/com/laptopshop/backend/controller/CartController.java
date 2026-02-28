package com.laptopshop.backend.controller;

import com.laptopshop.backend.Service.CartService;
import com.laptopshop.backend.Service.UserService;
import com.laptopshop.backend.model.Cart;
import com.laptopshop.backend.model.CartItem;
import com.laptopshop.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
//    @GetMapping
//    public ResponseEntity<?> getCart(
//            Authentication authentication,
//            @RequestParam(defaultValue = "1") int page,
//            @RequestParam(defaultValue = "8") int size
//    ) {
//        User user = userService.getCurrentUser(authentication);
//        Page<CartItem> CartItemPage = cartService.getCartItems(user,page-1,size);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("Items", CartItemPage.getContent());
//        response.put("page", page);
//        response.put("size", size);
//        response.put("totalItems", CartItemPage.getTotalElements());
//        response.put("totalPage", CartItemPage.getTotalPages());
//
//        return ResponseEntity.ok(response);
//    }

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

package com.laptopshop.backend.Service;


import com.laptopshop.backend.model.Cart;
import com.laptopshop.backend.model.CartItem;
import com.laptopshop.backend.model.Product;
import com.laptopshop.backend.model.User;
import com.laptopshop.backend.repository.CartRepository;
import com.laptopshop.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart getCartByUser(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    public Cart addToCart(User user, Long productId, int quantity) {
        Cart cart = getCartByUser(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // kiểm tra item đã tồn tại chưa
        Optional<CartItem> existingItem = cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if(existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPrice(product.getPrice());
            cart.getItems().add(item);
        }
        return cartRepository.save(cart);
    }

    /**
     * Xóa 1 sản phẩm khỏi cart
     *
     * @return
     */
    public Cart removeItem(User user, Long productId) {
        Cart cart = getCartByUser(user);

        cart.getItems().removeIf(
                item -> item.getProduct().getId().equals(productId)
        );

        cartRepository.save(cart);
        return cart;
    }

    /**
     * Cập nhật số lượng
     */
    public Cart updateQuantity(User user, Long productId, int quantity) {
        Cart cart = getCartByUser(user);

        cart.getItems().forEach(item -> {
            if (item.getProduct().getId().equals(productId)) {
                item.setQuantity(quantity);
            }
        });

        return cartRepository.save(cart);
    }

}

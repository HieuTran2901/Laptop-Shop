package com.laptopshop.backend.controller;

import com.laptopshop.backend.dto.LoginRequest;
import com.laptopshop.backend.model.Product;
import com.laptopshop.backend.model.User;
import com.laptopshop.backend.Service.UserService;
import com.laptopshop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.laptopshop.backend.dto.LoginRequest;
import com.laptopshop.backend.dto.LoginResponse;
import com.laptopshop.backend.dto.RegisterRequest;
import com.laptopshop.backend.util.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins=  "*") //Cho phép React

public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User u = userService.getUserById(id);
        if (u == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(u);
    }

    @PutMapping
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable  Long id) {
        userService.deleteUser(id);
    }

}

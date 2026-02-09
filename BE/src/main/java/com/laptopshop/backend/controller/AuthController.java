package com.laptopshop.backend.controller;

import com.laptopshop.backend.Service.UserService;
import com.laptopshop.backend.dto.LoginRequest;
import com.laptopshop.backend.dto.LoginResponse;
import com.laptopshop.backend.dto.RegisterRequest;
import com.laptopshop.backend.model.User;
import com.laptopshop.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userService.getAllUsers().stream().anyMatch(u -> u.getUserName().equals(req.getUsername()))) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        User user = new User(req.getUsername(), req.getPassword(), req.getEmail(), "ROLE_USER");
        User saved = userService.registerUser(user);
        return ResponseEntity.ok(saved.getUserName());
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getUsername(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getUserName());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}

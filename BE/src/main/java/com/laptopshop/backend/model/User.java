package com.laptopshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data // Lombok để tạo getter/setter tự động
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // nulltable: bắt buộc nhập, unique = true: không được trùng
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String fullName;

    private String phone;

    private String address;

    @Column(nullable = false)
    private String role = "USER"; // USER hoặc ADMIN

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    // constructors
    public User() {}
    public User(String username, String password, String email, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public String getUserName() {return username;}
    public void setUsername(String username) { this.username = username;}

    public String getEmail() {return email;}
    public void setEmail(String email) { this.email = email; }

    public String getRole() {return role;}
    public void setRole(String role) { this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public void setToken(String token) {
    }
}

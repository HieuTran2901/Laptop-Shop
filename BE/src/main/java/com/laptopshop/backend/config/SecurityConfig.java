package com.laptopshop.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.laptopshop.backend.Security.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // Tạo bean PasswordEncoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // Bật CORS, sử dụng CorsConfigurationSource bean
                .cors(cors -> {})

                // Quyền truy cập
                .authorizeHttpRequests(auth -> auth
                        //API public có thể dùng;
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/auth/register","/auth/login").permitAll()

//                      //Các api khác trong user phải xác thực mới dc vào
                        .requestMatchers("/api/users/**","/api/products/**").authenticated()
                                .requestMatchers("/api/payment/momo/ipn").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // HTTP Basic theo lambda style
                .httpBasic(httpBasic -> {});
//                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}

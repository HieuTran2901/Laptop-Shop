package com.laptopshop.backend.controller;

import com.laptopshop.backend.Service.MomoService;
import com.laptopshop.backend.dto.PaymentRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final MomoService momoService;

    @PostMapping("/momo")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO dto) throws Exception {
        String payUrl = momoService.createPayment(dto.getAmount(), dto.getOrderId());
        return ResponseEntity.ok(Map.of("payUrl", payUrl));
    }

    @PostMapping("/momo/ipn")
    public ResponseEntity<?> handleIPN(@RequestBody Map<String, Object> payload) throws Exception {
        momoService.processIPN(payload);
        return ResponseEntity.ok().build();
    }
}

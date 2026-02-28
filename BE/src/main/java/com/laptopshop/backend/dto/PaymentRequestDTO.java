package com.laptopshop.backend.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long amount;
    private String orderId;
}

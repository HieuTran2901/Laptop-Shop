package com.laptopshop.backend.Service;

import com.laptopshop.backend.config.MomoConfig;
import com.laptopshop.backend.model.Order;
import com.laptopshop.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.codec.binary.Hex;
import org.springframework.web.client.RestTemplate;

import static org.springframework.security.crypto.codec.Hex.*;

@Service
@RequiredArgsConstructor
public class MomoService {
    private final MomoConfig config;
    private final OrderRepository orderRepository;

    public String createPayment(Long amount, String orderId) throws Exception {

        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toán đơn hàng" + orderId;
        String requestType = "captureWallet";
        String extraData = "";

        String rawHash = "accessKey=" +config.getAccessKey() +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + config.getIpnUrl() +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + config.getPartnerCode() +
                "&redirectUrl=" + config.getRedirectUrl() +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = hmacSHA256(rawHash, config.getSecretKey());

        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", config.getPartnerCode());
        body.put("accessKey", config.getAccessKey());
        body.put("requestId", requestId);
        body.put("amount", amount.toString());
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", config.getRedirectUrl());
        body.put("ipnUrl", config.getIpnUrl());
        body.put("extraData", extraData);
        body.put("requestType", requestType);
        body.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(
                config.getEndpoint(),
                body,
                Map.class
        );

        return response.getBody().get("payUrl").toString();
    }

    private boolean verifySignature(Map<String, Object> payload) throws Exception {

        String rawHash =
                "accessKey=" + config.getAccessKey() +
                        "&amount=" + payload.get("amount") +
                        "&extraData=" + payload.get("extraData") +
                        "&message=" + payload.get("message") +
                        "&orderId=" + payload.get("orderId") +
                        "&orderInfo=" + payload.get("orderInfo") +
                        "&orderType=" + payload.get("orderType") +
                        "&partnerCode=" + payload.get("partnerCode") +
                        "&payType=" + payload.get("payType") +
                        "&requestId=" + payload.get("requestId") +
                        "&responseTime=" + payload.get("responseTime") +
                        "&resultCode=" + payload.get("resultCode") +
                        "&transId=" + payload.get("transId");

        String generatedSignature = hmacSHA256(rawHash, config.getSecretKey());

        return generatedSignature.equals(payload.get("signature"));
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes());
        return Hex.encodeHexString(hash);
    }

    public void processIPN(Map<String, Object> payload) throws Exception {
        boolean isValid = verifySignature(payload);

        if(!isValid) {
            throw new RuntimeException("Invalid signature");
        }

        int resultCode = Integer.parseInt(payload.get("resultCode").toString());
        String orderId = payload.get("orderId").toString();

        if(resultCode ==0) {
            updateOrderStatus(orderId, "PAID", payload);
        } else {
            updateOrderStatus(orderId, "CANCELLED", payload);
        }
    }

    public void updateOrderStatus(String orderId, String status, Map<String, Object> payload)  {
        Order order = orderRepository.findByOrderCode(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Avoid update two time
        if("PAID".equals(order.getStatus())) {
            return;
        }

        order.setStatus(status);
        order.setPaymentMethod("MOMO");
        order.setCreatedAt(LocalDateTime.now());
        order.setMomoTransactionId(payload.get("transId").toString());
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }
}

package com.gym.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Value
@Builder
public class BillResponse {
    Long id;
    Long memberId;
    String memberName;
    BigDecimal amount;
    String description;
    LocalDate dueDate;
    String status;
    LocalDateTime createdAt;
}



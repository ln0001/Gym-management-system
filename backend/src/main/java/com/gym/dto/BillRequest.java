package com.gym.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillRequest {

    @NotNull
    private Long memberId;

    @NotNull
    private BigDecimal amount;

    @NotBlank
    private String description;

    @NotNull
    private LocalDate dueDate;

    private String status = "pending";
}



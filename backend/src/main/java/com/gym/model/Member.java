package com.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String address;
    private LocalDate joinDate;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String role;

    private Long feePackageId;
    private String feePackageName;
    private BigDecimal feePackageAmount;
    private LocalDateTime assignedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        final LocalDateTime now = LocalDateTime.now();
        if (joinDate == null) {
            joinDate = LocalDate.now();
        }
        if (status == null) {
            status = "active";
        }
        if (role == null) {
            role = "member";
        }
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}



package com.gym.controller;

import com.gym.dto.BillResponse;
import com.gym.model.Bill;
import com.gym.model.Member;
import com.gym.repository.BillRepository;
import com.gym.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BillRepository billRepository;

    @GetMapping
    public ResponseEntity<?> getReport(
        @RequestParam String type,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        switch (type.toLowerCase()) {
            case "members":
                List<Member> members = memberRepository.findAll();
                return ResponseEntity.ok(members);
            case "bills":
                List<Bill> bills = filterBillsByDate(startDate, endDate);
                return ResponseEntity.ok(bills.stream().map(this::toResponse).collect(Collectors.toList()));
            case "payments":
                List<Bill> payments = filterBillsByDate(startDate, endDate).stream()
                    .filter(b -> "paid".equalsIgnoreCase(b.getStatus()))
                    .collect(Collectors.toList());
                return ResponseEntity.ok(payments.stream().map(this::toResponse).collect(Collectors.toList()));
            default:
                return ResponseEntity.badRequest().body("Unsupported report type");
        }
    }

    private List<Bill> filterBillsByDate(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDate.of(1970, 1, 1).atStartOfDay();
        LocalDateTime end = endDate != null ? endDate.plusDays(1).atStartOfDay() : LocalDate.now().plusDays(1).atStartOfDay();
        return billRepository.findAll().stream()
            .filter(bill -> {
                LocalDateTime created = bill.getCreatedAt();
                return created != null && !created.isBefore(start) && created.isBefore(end);
            })
            .collect(Collectors.toList());
    }

    private BillResponse toResponse(Bill bill) {
        return BillResponse.builder()
            .id(bill.getId())
            .memberId(bill.getMember().getId())
            .memberName(bill.getMember().getName())
            .amount(bill.getAmount())
            .description(bill.getDescription())
            .dueDate(bill.getDueDate())
            .status(bill.getStatus())
            .createdAt(bill.getCreatedAt())
            .build();
    }
}



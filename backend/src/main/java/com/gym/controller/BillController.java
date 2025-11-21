package com.gym.controller;

import com.gym.dto.BillRequest;
import com.gym.dto.BillResponse;
import com.gym.model.Bill;
import com.gym.model.Member;
import com.gym.repository.BillRepository;
import com.gym.repository.MemberRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping
    public List<BillResponse> getBills() {
        return billRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @GetMapping("/member/{memberId}")
    public List<BillResponse> getBillsForMember(@PathVariable Long memberId) {
        return billRepository.findByMemberId(memberId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<BillResponse> searchBills(@RequestParam("term") String term) {
        return billRepository.searchByDescription(term).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<BillResponse> createBill(@Valid @RequestBody BillRequest request) {
        Member member = memberRepository.findById(request.getMemberId()).orElse(null);
        if (member == null) {
            return ResponseEntity.badRequest().build();
        }

        Bill bill = Bill.builder()
            .member(member)
            .amount(request.getAmount())
            .description(request.getDescription())
            .dueDate(request.getDueDate())
            .status(request.getStatus())
            .build();

        return ResponseEntity.ok(toResponse(billRepository.save(bill)));
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



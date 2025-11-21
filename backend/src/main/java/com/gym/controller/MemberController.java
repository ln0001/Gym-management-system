package com.gym.controller;

import com.gym.model.FeePackage;
import com.gym.model.Member;
import com.gym.repository.FeePackageRepository;
import com.gym.repository.MemberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private FeePackageRepository feePackageRepository;

    @GetMapping
    public List<Member> getMembers() {
        return memberRepository.findAll();
    }

    @GetMapping("/search")
    public List<Member> searchMembers(@RequestParam("term") String term) {
        return memberRepository.searchByTerm(term);
    }

    @GetMapping("/by-email")
    public ResponseEntity<Member> getMemberByEmail(@RequestParam("email") String email) {
        return memberRepository.findByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Member createMember(@RequestBody Member member) {
        logger.info("Creating member {}", member.getEmail());
        member.setId(null);
        if (member.getJoinDate() == null) {
            member.setJoinDate(LocalDate.now());
        }
        if (member.getStatus() == null) {
            member.setStatus("active");
        }
        if (member.getRole() == null) {
            member.setRole("member");
        }
        return memberRepository.save(member);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member update) {
        return memberRepository.findById(id)
            .map(existing -> {
                existing.setName(update.getName());
                existing.setEmail(update.getEmail());
                existing.setPhone(update.getPhone());
                existing.setAddress(update.getAddress());
                existing.setJoinDate(update.getJoinDate());
                existing.setStatus(update.getStatus());
                return ResponseEntity.ok(memberRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (!memberRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        memberRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{memberId}/assign-package/{packageId}")
    public ResponseEntity<Member> assignPackage(
        @PathVariable Long memberId,
        @PathVariable Long packageId
    ) {
        Member member = memberRepository.findById(memberId).orElse(null);
        FeePackage feePackage = feePackageRepository.findById(packageId).orElse(null);

        if (member == null || feePackage == null) {
            return ResponseEntity.notFound().build();
        }

        member.setFeePackageId(feePackage.getId());
        member.setFeePackageName(feePackage.getName());
        member.setFeePackageAmount(feePackage.getAmount() != null ? feePackage.getAmount() : BigDecimal.ZERO);
        member.setAssignedAt(LocalDateTime.now());

        return ResponseEntity.ok(memberRepository.save(member));
    }
}



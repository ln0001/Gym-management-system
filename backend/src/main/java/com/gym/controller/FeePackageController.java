package com.gym.controller;

import com.gym.model.FeePackage;
import com.gym.repository.FeePackageRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-packages")
@CrossOrigin(origins = "*")
public class FeePackageController {

    @Autowired
    private FeePackageRepository feePackageRepository;

    @GetMapping
    public List<FeePackage> listPackages() {
        return feePackageRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<FeePackage> createPackage(@Valid @RequestBody FeePackage feePackage) {
        if (feePackageRepository.existsByName(feePackage.getName())) {
            return ResponseEntity.badRequest().build();
        }
        feePackage.setId(null);
        return ResponseEntity.ok(feePackageRepository.save(feePackage));
    }
}



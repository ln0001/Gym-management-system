package com.gym.repository;

import com.gym.model.FeePackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeePackageRepository extends JpaRepository<FeePackage, Long> {
    boolean existsByName(String name);
}



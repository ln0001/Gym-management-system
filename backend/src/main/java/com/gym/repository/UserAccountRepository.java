package com.gym.repository;

import com.gym.model.UserAccount;
import com.gym.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmail(String email);
    Optional<UserAccount> findByEmailAndRole(String email, UserRole role);
    boolean existsByEmail(String email);
}



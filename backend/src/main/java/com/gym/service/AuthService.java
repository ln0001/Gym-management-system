package com.gym.service;

import com.gym.dto.LoginRequest;
import com.gym.dto.LoginResponse;
import com.gym.dto.SignupRequest;
import com.gym.model.Member;
import com.gym.model.UserAccount;
import com.gym.model.UserRole;
import com.gym.repository.MemberRepository;
import com.gym.repository.UserAccountRepository;
import com.gym.util.LoggingUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LoggingUtil loggingUtil;

    public LoginResponse login(LoginRequest request) {
        UserRole requestedRole = resolveRole(request.getRole());
        loggingUtil.logActivity(
            request.getEmail(),
            "LOGIN_ATTEMPT",
            "User attempted to login with role: " + requestedRole.name()
        );

        UserAccount account = userAccountRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (account.getRole() != requestedRole) {
            loggingUtil.logActivity(
                request.getEmail(),
                "LOGIN_FAILED",
                "Role mismatch. Expected " + account.getRole()
            );
            throw new IllegalArgumentException("Invalid role for this account");
        }

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            loggingUtil.logActivity(
                request.getEmail(),
                "LOGIN_FAILED",
                "Incorrect password"
            );
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = UUID.randomUUID().toString();
        loggingUtil.logActivity(
            request.getEmail(),
            "LOGIN_SUCCESS",
            "User successfully logged in with role: " + account.getRole()
        );

        return new LoginResponse(token, account.getEmail(), account.getRole().name().toLowerCase(), "Login successful");
    }

    public LoginResponse signup(SignupRequest request) {
        UserRole role = resolveRole(request.getRole());
        if (userAccountRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        UserAccount account = UserAccount.builder()
            .email(request.getEmail())
            .name(request.getName())
            .role(role)
            .status("active")
            .password(passwordEncoder.encode(request.getPassword()))
            .build();
        account = userAccountRepository.save(account);

        if (role == UserRole.MEMBER) {
            Member member = memberRepository.findByEmail(request.getEmail())
                .orElseGet(() -> Member.builder()
                    .email(request.getEmail())
                    .build());
            member.setName(request.getName() != null ? request.getName() : request.getEmail());
            member.setStatus("active");
            member.setRole("member");
            memberRepository.save(member);
        }

        loggingUtil.logActivity(
            request.getEmail(),
            "SIGNUP",
            "Account created with role: " + role.name()
        );

        return new LoginResponse(null, account.getEmail(), role.name().toLowerCase(), "Account created successfully");
    }

    public void logout(String token, String email) {
        loggingUtil.logActivity(
            email != null ? email : "unknown",
            "LOGOUT",
            "User logged out. Token: " + token
        );
    }

    private UserRole resolveRole(String role) {
        try {
            return UserRole.valueOf(role.toUpperCase());
        } catch (Exception e) {
            logger.error("Invalid role: {}", role);
            throw new IllegalArgumentException("Invalid role specified");
        }
    }
}


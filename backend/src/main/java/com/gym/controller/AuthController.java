package com.gym.controller;

import com.gym.dto.LoginRequest;
import com.gym.dto.LoginResponse;
import com.gym.dto.SignupRequest;
import com.gym.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login attempt for email: {} with role: {}", request.getEmail(), request.getRole());
        try {
            LoginResponse response = authService.login(request);
            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Login failed for email: {} - Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new LoginResponse(null, request.getEmail(), request.getRole(), e.getMessage())
            );
        } catch (Exception e) {
            logger.error("Unexpected login error for email: {} - Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.internalServerError().body(
                new LoginResponse(null, request.getEmail(), request.getRole(), "Unexpected error during login")
            );
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@Valid @RequestBody SignupRequest request) {
        logger.info("Signup attempt for email: {} with role: {}", request.getEmail(), request.getRole());
        try {
            LoginResponse response = authService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            logger.error("Signup failed for email: {} - Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(
                new LoginResponse(null, request.getEmail(), request.getRole(), e.getMessage())
            );
        } catch (Exception e) {
            logger.error("Unexpected signup error for email: {} - Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.internalServerError().body(
                new LoginResponse(null, request.getEmail(), request.getRole(), "Unexpected error during signup")
            );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
        @RequestHeader("Authorization") String token,
        @RequestHeader(value = "X-User-Email", required = false) String email
    ) {
        logger.info("Logout request received");
        try {
            authService.logout(token, email);
            logger.info("Logout successful");
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            logger.error("Logout failed - Error: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}


package com.gym.config;

import com.gym.model.*;
import com.gym.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner seedData(
        UserAccountRepository userAccountRepository,
        MemberRepository memberRepository,
        FeePackageRepository feePackageRepository,
        SupplementRepository supplementRepository,
        DietPlanRepository dietPlanRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userAccountRepository.count() == 0) {
                logger.info("Seeding default admin user");
                UserAccount admin = UserAccount.builder()
                    .email("admin@gym.com")
                    .name("Admin")
                    .role(UserRole.ADMIN)
                    .status("active")
                    .password(passwordEncoder.encode("admin123"))
                    .build();
                userAccountRepository.save(admin);
            }

            if (memberRepository.count() == 0) {
                logger.info("Seeding sample member");
                Member member = Member.builder()
                    .name("John Doe")
                    .email("member@gym.com")
                    .phone("1234567890")
                    .status("active")
                    .role("member")
                    .joinDate(LocalDate.now())
                    .build();
                memberRepository.save(member);

                if (!userAccountRepository.existsByEmail("member@gym.com")) {
                    userAccountRepository.save(UserAccount.builder()
                        .email("member@gym.com")
                        .name("John Doe")
                        .role(UserRole.MEMBER)
                        .status("active")
                        .password(passwordEncoder.encode("member123"))
                        .build());
                }
            }

            if (feePackageRepository.count() == 0) {
                feePackageRepository.save(FeePackage.builder()
                    .name("Basic Plan")
                    .amount(BigDecimal.valueOf(49.99))
                    .durationMonths(1)
                    .description("Access to gym floor and basic classes")
                    .build());
            }

            if (supplementRepository.count() == 0) {
                supplementRepository.save(Supplement.builder()
                    .name("Whey Protein")
                    .category("protein")
                    .description("High quality whey protein powder")
                    .price(BigDecimal.valueOf(39.99))
                    .stock(25)
                    .build());
            }

            if (dietPlanRepository.count() == 0) {
                dietPlanRepository.save(DietPlan.builder()
                    .title("Weight Loss Starter")
                    .category("weight-loss")
                    .description("Beginner friendly weight loss plan")
                    .mealPlan("Breakfast: Oatmeal\nLunch: Grilled chicken\nDinner: Salad")
                    .calories(1800)
                    .durationWeeks(4)
                    .build());
            }
        };
    }
}



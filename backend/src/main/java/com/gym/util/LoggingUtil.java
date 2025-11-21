package com.gym.util;

import com.gym.model.ActivityLog;
import com.gym.repository.ActivityLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class LoggingUtil {

    private static final Logger logger = LoggerFactory.getLogger(LoggingUtil.class);

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logActivity(String userId, String action, String details) {
        try {
            logger.info("Activity Log - User: {}, Action: {}, Details: {}", userId, action, details);
            ActivityLog logEntry = ActivityLog.builder()
                .userIdentifier(userId)
                .action(action)
                .details(details)
                .createdAt(LocalDateTime.now())
                .build();
            activityLogRepository.save(logEntry);
        } catch (Exception e) {
            logger.error("Error logging activity: {}", e.getMessage());
        }
    }
}


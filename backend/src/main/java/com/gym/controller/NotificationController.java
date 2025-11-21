package com.gym.controller;

import com.gym.model.Notification;
import com.gym.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> list(@RequestParam(value = "audience", required = false) String audience) {
        if (audience == null || audience.isBlank()) {
            return notificationRepository.findAll();
        }
        if ("members".equalsIgnoreCase(audience)) {
            return notificationRepository.findByAudiences(Arrays.asList("members", "all"));
        }
        return notificationRepository.findByAudiences(List.of(audience));
    }

    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        notification.setId(null);
        return notificationRepository.save(notification);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id)
            .map(existing -> {
                existing.setReadFlag(true);
                return ResponseEntity.ok(notificationRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}



package com.gym.controller;

import com.gym.model.DietPlan;
import com.gym.repository.DietPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diet-plans")
@CrossOrigin(origins = "*")
public class DietPlanController {

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @GetMapping
    public List<DietPlan> list() {
        return dietPlanRepository.findAll();
    }

    @PostMapping
    public DietPlan create(@RequestBody DietPlan dietPlan) {
        dietPlan.setId(null);
        return dietPlanRepository.save(dietPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DietPlan> update(@PathVariable Long id, @RequestBody DietPlan update) {
        return dietPlanRepository.findById(id)
            .map(existing -> {
                existing.setTitle(update.getTitle());
                existing.setCategory(update.getCategory());
                existing.setDescription(update.getDescription());
                existing.setMealPlan(update.getMealPlan());
                existing.setCalories(update.getCalories());
                existing.setDurationWeeks(update.getDurationWeeks());
                return ResponseEntity.ok(dietPlanRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!dietPlanRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dietPlanRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}



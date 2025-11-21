package com.gym.controller;

import com.gym.model.Supplement;
import com.gym.repository.SupplementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplements")
@CrossOrigin(origins = "*")
public class SupplementController {

    @Autowired
    private SupplementRepository supplementRepository;

    @GetMapping
    public List<Supplement> list(@RequestParam(value = "term", required = false) String term) {
        if (term == null || term.isBlank()) {
            return supplementRepository.findAll();
        }
        return supplementRepository.search(term);
    }

    @PostMapping
    public Supplement create(@RequestBody Supplement supplement) {
        supplement.setId(null);
        return supplementRepository.save(supplement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplement> update(@PathVariable Long id, @RequestBody Supplement update) {
        return supplementRepository.findById(id)
            .map(existing -> {
                existing.setName(update.getName());
                existing.setDescription(update.getDescription());
                existing.setCategory(update.getCategory());
                existing.setPrice(update.getPrice());
                existing.setStock(update.getStock());
                return ResponseEntity.ok(supplementRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!supplementRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplementRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}



package com.gym.repository;

import com.gym.model.Supplement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplementRepository extends JpaRepository<Supplement, Long> {

    @Query("SELECT s FROM Supplement s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :term, '%')) " +
        "OR LOWER(s.category) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Supplement> search(@Param("term") String term);
}



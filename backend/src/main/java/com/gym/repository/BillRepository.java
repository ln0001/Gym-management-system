package com.gym.repository;

import com.gym.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByMemberId(Long memberId);

    @Query("SELECT b FROM Bill b WHERE LOWER(b.description) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Bill> searchByDescription(@Param("term") String term);
}



package com.gym.repository;

import com.gym.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    @Query("SELECT m FROM Member m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :term, '%')) " +
        "OR LOWER(m.email) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Member> searchByTerm(@Param("term") String term);
}



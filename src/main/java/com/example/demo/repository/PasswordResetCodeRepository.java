package com.example.demo.repository;

import com.example.demo.model.PasswordResetCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Long> {
    PasswordResetCode findByUserEmailAndCode(String email, String code);
}
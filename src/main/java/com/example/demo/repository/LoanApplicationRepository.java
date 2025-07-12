package com.example.demo.repository;

import com.example.demo.model.LoanApplication;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    // All applications by a client
    List<LoanApplication> findByUser(User user);

    // All applications by status
    List<LoanApplication> findByStatus(String status);

    // All applications by user and status
    List<LoanApplication> findByUserAndStatus(User user, String status);
}

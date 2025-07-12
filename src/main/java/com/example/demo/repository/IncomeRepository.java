package com.example.demo.repository;

import com.example.demo.model.Income;
import com.example.demo.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByLoanApplication(LoanApplication loanApplication);
}

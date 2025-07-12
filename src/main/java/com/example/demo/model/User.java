package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private String password;

    private String role; // client or bank_employee

    private String firstName;
    private String lastName;

    private String email;

    private LocalDateTime loginTime;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<LoanApplication> loanApplications;
}
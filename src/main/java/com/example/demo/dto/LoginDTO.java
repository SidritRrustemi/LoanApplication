package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@Data
public class LoginDTO {
    private String username;
    private String password;
}
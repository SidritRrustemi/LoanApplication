package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@Data
public class RegisterUserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
}

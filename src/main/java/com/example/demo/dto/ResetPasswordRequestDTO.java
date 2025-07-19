package com.example.demo.dto;

import lombok.Data;

@Data
public class ResetPasswordRequestDTO {
    private String email;
    private String code;
    private String newPassword;
}
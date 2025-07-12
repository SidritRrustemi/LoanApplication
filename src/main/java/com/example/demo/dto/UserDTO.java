package com.example.demo.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String firstName;
    private String lastName;
    private String username;
    private String email;

    public UserDTO(String firstName, String lastName, String username, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
    }
}
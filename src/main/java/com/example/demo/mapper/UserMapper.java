package com.example.demo.mapper;

import com.example.demo.dto.RegisterUserDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.User;

public class UserMapper {

    public static User toEntity(RegisterUserDTO dto) {
        User user = new User();
        user.setId(null);
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRole("client");
        return user;
    }

    public static UserDTO toDTO(User user) {
        return new UserDTO(
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
package com.example.demo.service;

import com.example.demo.model.User;

public interface UserService {
    User register(User user);
    User authenticateClient(String username, String password);
    User authenticateEmployee(String username, String password);
    boolean usernameExists(String username);
    User findByUsername(String username);
    User save(User user);
}
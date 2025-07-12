package com.example.demo.service.impl;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User authenticateClient(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .filter(u -> u.getRole().equalsIgnoreCase("client"))
                .orElse(null);
    }

    @Override
    public User authenticateEmployee(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .filter(u -> u.getRole().equalsIgnoreCase("bank_employee"))
                .orElse(null);
    }

    @Override
    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
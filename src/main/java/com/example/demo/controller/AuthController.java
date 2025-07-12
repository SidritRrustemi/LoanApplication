package com.example.demo.controller;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.RegisterUserDTO;
import com.example.demo.model.User;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;
import com.example.demo.mapper.UserMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    // Constructor injection (Spring automatically detects this)
    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterUserDTO dto) {
        if (userService.usernameExists(dto.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        User user = UserMapper.toEntity(dto);
        user.setLoginTime(LocalDateTime.now());
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login_client")
    public ResponseEntity<?> loginClient(@RequestBody LoginDTO dto) {
        User user = userService.authenticateClient(dto.getUsername(), dto.getPassword());
        if (user != null) {
            String token = jwtService.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getUsername(),
                    "role", user.getRole()
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/login_employee")
    public ResponseEntity<?> loginEmployee(@RequestBody LoginDTO dto) {
        User user = userService.authenticateEmployee(dto.getUsername(), dto.getPassword());
        if (user != null) {
            String token = jwtService.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getUsername(),
                    "role", user.getRole()
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
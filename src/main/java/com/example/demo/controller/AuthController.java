package com.example.demo.controller;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.RegisterUserDTO;
import com.example.demo.dto.ResetPasswordRequestDTO;
import com.example.demo.dto.VerifyCodeRequestDTO;
import com.example.demo.model.PasswordResetCode;
import com.example.demo.model.RateLimiter;
import com.example.demo.model.User;
import com.example.demo.service.EmailService;
import com.example.demo.service.JwtService;
import com.example.demo.service.PasswordResetService;
import com.example.demo.service.UserService;
import com.example.demo.mapper.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PasswordResetService passwordResetService;
    private final RateLimiter rateLimiter;

    // Constructor injection (Spring automatically detects this)
    public AuthController(UserService userService, JwtService jwtService, EmailService emailService, PasswordResetService passwordResetService, RateLimiter rateLimiter) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.passwordResetService = passwordResetService;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterUserDTO dto) {
        if (userService.usernameExists(dto.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        if (userService.emailExists(dto.getEmail())) {
            return ResponseEntity.badRequest().body("An account with this email address already exists!");
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

    @PostMapping("/request-reset-code")
    public ResponseEntity<?> sendResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("Received email: " + email);
        if (!rateLimiter.isAllowed(email)) {
            return ResponseEntity.status(429).body("Too many requests. Try again in 15 seconds.");
        }

        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Email not found");

        String code = String.format("%06d", new Random().nextInt(999999));
        passwordResetService.createResetCode(user, code, LocalDateTime.now().plusMinutes(10));

        emailService.sendEmail(email, "Your Reset Code", "Your password reset code is: " + code);

        return ResponseEntity.ok("Reset code sent to your email.");
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody VerifyCodeRequestDTO request) {
        PasswordResetCode resetCode = passwordResetService.getValidCode(request.getEmail(), request.getCode());

        if (resetCode == null) {
            return ResponseEntity.badRequest().body("Invalid or expired code.");
        }

        return ResponseEntity.ok("Code verified successfully.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        PasswordResetCode resetCode = passwordResetService.getValidCode(request.getEmail(), request.getCode());

        if (resetCode == null) {
            return ResponseEntity.badRequest().body("Invalid or expired code.");
        }

        User user = resetCode.getUser();
        user.setPassword(request.getNewPassword());
        userService.saveAndEncode(user);

        passwordResetService.markCodeAsUsed(resetCode);

        return ResponseEntity.ok("Password reset successfully.");
    }
}
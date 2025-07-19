package com.example.demo.service;

import com.example.demo.model.PasswordResetCode;
import com.example.demo.model.User;
import com.example.demo.repository.PasswordResetCodeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PasswordResetService {

    private final PasswordResetCodeRepository resetCodeRepository;

    public PasswordResetService(PasswordResetCodeRepository resetCodeRepository) {
        this.resetCodeRepository = resetCodeRepository;
    }

    public void createResetCode(User user, String code, LocalDateTime expiry) {
        PasswordResetCode resetCode = new PasswordResetCode(user, code, expiry);
        resetCodeRepository.save(resetCode);
    }

    public PasswordResetCode getValidCode(String email, String code) {
        PasswordResetCode resetCode = resetCodeRepository.findByUserEmailAndCode(email, code);
        if (resetCode == null || resetCode.isUsed() || resetCode.getExpiryTime().isBefore(LocalDateTime.now())) {
            return null;
        }
        return resetCode;
    }

    public void markCodeAsUsed(PasswordResetCode code) {
        code.setUsed(true);
        resetCodeRepository.save(code);
    }
}

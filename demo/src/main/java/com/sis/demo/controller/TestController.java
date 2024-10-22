package com.sis.demo.controller;

import com.sis.demo.dto.AuthRequest;
import com.sis.demo.dto.AuthResponse;
import com.sis.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/test")
public class TestController {


    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<String> testJwt(@RequestBody AuthResponse authResponse) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(jwtUtil.extractUsername(authResponse.getJwt()));

        if (authentication != null && authentication.isAuthenticated()) {
            String currentUser = authentication.getName();
            return ResponseEntity.ok("JWT je validan. Trenutni korisnik: " + currentUser);
        } else {
            return ResponseEntity.status(401).body("Nije autorizovano");
        }
    }
}
package com.sis.demo.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.sis.demo.dto.AuthRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private FirebaseAuth firebaseAuth;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody AuthRequest authRequest) {
        System.out.println("Registracija korisnika: " + authRequest.getEmail());
        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(authRequest.getEmail())
                    .setPassword(authRequest.getPassword());

            UserRecord userRecord = firebaseAuth.createUser(request);
            return ResponseEntity.ok("Korisnik uspješno registriran: " + userRecord.getUid());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Greška pri registraciji: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody AuthRequest authRequest) {
        try {
            UserRecord userRecord = firebaseAuth.getUserByEmail(authRequest.getEmail());
            return ResponseEntity.ok("Korisnik uspješno prijavljen: " + userRecord.getUid());
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body("Neuspješna prijava: " + e.getMessage());
        }
    }
}

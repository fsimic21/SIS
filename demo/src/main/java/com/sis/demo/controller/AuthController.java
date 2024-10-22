package com.sis.demo.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.sis.demo.dto.AuthRequest;
import com.sis.demo.dto.AuthResponse;
import com.sis.demo.dto.UserDto;
import com.sis.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Security;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private FirebaseAuth firebaseAuth;

    @Autowired
    private JwtUtil jwtUtil;

 @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDto userDto) {
        System.out.println("Registracija korisnika: " + userDto.getEmail());
        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(userDto.getEmail())
                    .setPassword(userDto.getPassword());

            UserRecord userRecord = firebaseAuth.createUser(request);
            return ResponseEntity.ok("Korisnik uspješno registriran: " + userRecord.getUid());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Greška pri registraciji: " + e.getMessage());
        }
    }

 @PostMapping("/login")
 public ResponseEntity<AuthResponse> loginUser(@RequestBody AuthRequest authRequest) {
     try {
         String uid = jwtUtil.verifyFirebaseToken(authRequest.getIdToken());
         String jwtToken = jwtUtil.generateToken(uid);
         return ResponseEntity.ok(new AuthResponse(jwtToken));
     } catch (FirebaseAuthException e) {
         return ResponseEntity.badRequest().body(new AuthResponse("Neuspješna prijava: " + e.getMessage()));
     }
 }
}

package com.sis.demo.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.sis.demo.dto.AuthRequest;
import com.sis.demo.dto.AuthResponse;
import com.sis.demo.dto.UserDto;
import com.sis.demo.service.GoogleAuthService;
import com.sis.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Security;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private FirebaseAuth firebaseAuth;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GoogleAuthService googleAuthService;


    @GetMapping("/generate-secret/{email}")
    public ResponseEntity<String> generateSecret(@PathVariable String email) {
        String secretKey = googleAuthService.generateSecretKey(email);
        return ResponseEntity.ok(secretKey);
    }


    @PostMapping("/verify/{username}/{code}")
    public ResponseEntity<Boolean> verifyCode(@PathVariable String username, @PathVariable int code) {
        String secretKey = googleAuthService.generateSecretKey(username);
        boolean isVerified = googleAuthService.validateCode(secretKey, code);
        if (isVerified) {
           return ResponseEntity.ok(true);
        }else{
           return ResponseEntity.ok(false);
        }
    }

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
     System.out.println(authRequest);
     try {
         String uid = jwtUtil.verifyFirebaseToken(authRequest.getIdToken());
         String jwtToken = jwtUtil.generateToken(firebaseAuth.getUser(uid).getEmail());
         System.out.println("uid: "+uid);
         System.out.println("email: "+firebaseAuth.getUser(uid).getEmail());
         System.out.println("jwt: "+jwtToken );
         return ResponseEntity.ok(new AuthResponse(jwtToken));
     } catch (FirebaseAuthException e) {
         return ResponseEntity.badRequest().body(new AuthResponse("Neuspješna prijava: " + e.getMessage()));
     }
 }
}

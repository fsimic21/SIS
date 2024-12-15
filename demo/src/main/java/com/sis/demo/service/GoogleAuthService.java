package com.sis.demo.service;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.apache.commons.codec.binary.Base32;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class GoogleAuthService {

    private final GoogleAuthenticator googleAuthenticator;

    public GoogleAuthService() {
        this.googleAuthenticator = new GoogleAuthenticator();
    }

    // Generate a secret key for the user
    public String generateSecretKey(String username) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(username.getBytes());
            Base32 base32 = new Base32();
            String base32Encoded = base32.encodeAsString(hash);
            return base32Encoded.substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating secret key", e);
        }
    }


    // Validate the TOTP code entered by the user
    public boolean validateCode(String secretKey, int code) {
        return googleAuthenticator.authorize(secretKey, code);
    }
}


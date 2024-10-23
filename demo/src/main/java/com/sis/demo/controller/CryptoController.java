package com.sis.demo.controller;

import com.sis.demo.dto.CryptoRequest;
import com.sis.demo.service.VoteService;
import com.sis.demo.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Arrays;

@RestController
@RequestMapping("/api")
public class CryptoController {

    @Value("${app.crypto.privateKey}")
    private PrivateKey privateKey;

    @Value("${app.crypto.frontendPublicKey}")
    private  PublicKey frontendPublicKey;

    @Autowired
    VoteService voteService;

    @PostMapping("/submit-data")
    public String receiveData(@RequestBody CryptoRequest request) throws Exception {
        String encryptedData = request.getEncryptedData();
        String signature = request.getSignature();

        byte[] decryptedData = CryptoUtil.decryptData(encryptedData, privateKey);

        boolean isValidSignature = CryptoUtil.verifySignature(encryptedData, signature, frontendPublicKey);

        if (!isValidSignature) {
            return "Invalid signature!";
        }
        voteService.saveVote(Arrays.toString(decryptedData));
        return "Data is valid and decrypted: " + new String(decryptedData);
    }
}


package com.sis.demo.util;

import org.springframework.stereotype.Component;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.util.Base64;
import javax.crypto.Cipher;

@Component
public class CryptoUtil {

    public static byte[] decryptData(String encryptedData, PrivateKey privateKey)  {
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            return cipher.doFinal(Base64.getDecoder().decode(encryptedData));
        } catch (Exception e) {
            System.out.println("Greška prilikom dekriptiranja: " + e);
            return null;
        }
    }

    public static boolean verifySignature(String data, String signature, PublicKey publicKey)  {
        try{
            Signature sig = Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);
            sig.update(data.getBytes());
            return sig.verify(Base64.getDecoder().decode(signature));
        }catch (Exception e) {
            System.out.println("Greška prilikom provjere potpisa: " + e);
            return false;
        }

    }
}

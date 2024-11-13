package com.sis.demo.util;

import org.springframework.stereotype.Component;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.util.Base64;
import javax.crypto.Cipher;

@Component
public class CryptoUtil {

    public static byte[] decryptData(String encryptedData, PrivateKey privateKey) {
        try {
            byte[] encryptedBytes = Base64.getDecoder().decode(encryptedData);
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);

            return cipher.doFinal(encryptedBytes);

        } catch (Exception e) {
            System.out.println("Error during decryption: " + e);
            return null;
        }
    }



    public static boolean verifySignature(byte[] data, String signature, PublicKey publicKey)  {
        System.out.println("data "+data);
        System.out.println("signature: "+signature);
        System.out.println("public key"+publicKey);
        try {
            if (data == null || signature == null || publicKey == null) {
                throw new IllegalArgumentException("Data, signature, or public key is null");
            }

            byte[] signatureBytes = Base64.getDecoder().decode(signature);

            Signature sig = Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);
            sig.update(data);
            return sig.verify(signatureBytes);
        } catch (Exception e) {
            System.out.println("Greška prilikom provjere potpisa: " + e);
            return false;
        }
    }

}

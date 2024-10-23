package com.sis.demo.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Component
public class AesUtil {


    public static String encrypt(String algorithm, String input, SecretKey key) {
        try{
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] cipherText = cipher.doFinal(input.getBytes());
            return Base64.getEncoder()
                    .encodeToString(cipherText);
        } catch (Exception e) {
            System.out.println("Greška prilikom aes kriptiranja: "+ e);
            return null;
        }

    }


    public static String decrypt(String algorithm, String cipherText, SecretKey key) {
        try{
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] plainText = cipher.doFinal(Base64.getDecoder()
                    .decode(cipherText));
            return new String(plainText);
        }catch (Exception e) {
            System.out.println("Greška prilikom aes kriptiranja: "+ e);
            return null;
        }

    }
}

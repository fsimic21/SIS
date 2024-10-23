package com.sis.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CryptoRequest {
    private String encryptedData;
    private String signature;
}


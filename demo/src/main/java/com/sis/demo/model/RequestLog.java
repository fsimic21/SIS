package com.sis.demo.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestLog {
    private String email;
    private String path;
    private String requestType;
    private int response;
    private Instant timestamp;
}

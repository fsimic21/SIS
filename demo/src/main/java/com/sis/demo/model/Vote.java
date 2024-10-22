package com.sis.demo.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Vote {
    private String voterOib;
    private String candidateId;
    private String voteTimestamp;
}

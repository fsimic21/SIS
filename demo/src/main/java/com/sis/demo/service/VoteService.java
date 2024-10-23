package com.sis.demo.service;

import com.google.api.client.util.DateTime;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.sis.demo.model.Vote;
import com.sis.demo.util.AesUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

import javax.crypto.SecretKey;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;

@Service
public class VoteService {

    private final Firestore firestore;
    private final SecretKey aesKey;

    @Autowired
    public VoteService(Firestore firestore, SecretKey aesKey) {
        this.firestore = firestore;
        this.aesKey = aesKey;
    }

    public String saveVote(String string) throws Exception {
        String[] array = string.split("\\.");
        Vote vote = new Vote(array[0], array[1], Instant.now());
        vote.setVoterOib(AesUtil.encrypt("AES", vote.getVoterOib(), aesKey));
        vote.setCandidateId(AesUtil.encrypt("AES", vote.getCandidateId(), aesKey));

        CollectionReference votesCollection = firestore.collection("votes");

        try {
            DocumentReference docRef = votesCollection.add(vote).get();
            return "Vote saved with ID: " + docRef.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error saving vote: " + e.getMessage();
        }
    }
}


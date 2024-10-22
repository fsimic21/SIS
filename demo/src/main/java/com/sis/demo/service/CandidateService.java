package com.sis.demo.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.sis.demo.model.Candidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateService {

    private final Firestore firestore;

    @Autowired
    public CandidateService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Candidate> getAllCandidates() {
        List<Candidate> candidates = new ArrayList<>();

        try {
            CollectionReference candidatesRef = firestore.collection("candidates");
            ApiFuture<QuerySnapshot> querySnapshot = candidatesRef.get();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Candidate candidate = document.toObject(Candidate.class);
                candidate.setId(document.getId());
                candidates.add(candidate);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return candidates;
    }
}

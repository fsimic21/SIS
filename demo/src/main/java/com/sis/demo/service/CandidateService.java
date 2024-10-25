package com.sis.demo.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.sis.demo.model.Candidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.WriteResult;
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
    public String incrementVotes(String id) {
        try {
            CollectionReference candidatesRef = firestore.collection("candidates");
            DocumentReference candidateRef = candidatesRef.document(id);
            DocumentSnapshot candidateSnapshot = candidateRef.get().get();

            if (candidateSnapshot.exists()) {
                Candidate candidate = candidateSnapshot.toObject(Candidate.class);
                int currentVotes = candidate.getVotes();

                candidate.setVotes(currentVotes + 1);

                WriteResult writeResult = candidateRef.set(candidate).get();
                return "Votes updated successfully: " + writeResult.getUpdateTime();
            } else {
                return "Candidate not found!";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error updating votes: " + e.getMessage();
        }
    }

}

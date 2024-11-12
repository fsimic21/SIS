package com.sis.demo.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class OibMockService {
    private final Firestore firestore;

    @Autowired
    public OibMockService(Firestore firestore) {
        this.firestore = firestore;
    }

    public boolean checkOibExistence(String oib) {
        CollectionReference oibRef = firestore.collection("oibMockDB");

        try {
            ApiFuture<QuerySnapshot> query = oibRef.get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            for (QueryDocumentSnapshot document : documents) {
                String existingOib = document.getString("oib");
                if (existingOib != null && existingOib.equals(oib)) {
                    System.out.println("Oib postoji");
                    return true;
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        System.out.println("Oib ne postoji");
        return false;
    }

    public void setOibVoted(String oib) {
        CollectionReference candidatesRef = firestore.collection("oibMockDB");

        try {
            ApiFuture<QuerySnapshot> query = candidatesRef.whereEqualTo("oib", oib).get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();
            if (!documents.isEmpty()) {
                QueryDocumentSnapshot document = documents.get(0);
                String documentId = document.getId();
                ApiFuture<WriteResult> updateFuture = candidatesRef.document(documentId).update("voted", true);
                updateFuture.get();

                System.out.println("Voted status je postavljen na true za OIB: " + oib);
            } else {
                System.out.println("Dokument sa OIB-om " + oib + " nije pronađen.");
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}

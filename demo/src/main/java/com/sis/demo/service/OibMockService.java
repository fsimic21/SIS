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
            ApiFuture<QuerySnapshot> query = oibRef.whereEqualTo("oib", oib).get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            if (!documents.isEmpty()) {
                System.out.println("OIB postoji u bazi.");
                return true;
            } else {
                System.out.println("OIB ne postoji u bazi.");
                return false;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean checkOibVoted(String oib) {
        CollectionReference candidatesRef = firestore.collection("oibMockDB");

        try {
            ApiFuture<QuerySnapshot> query = candidatesRef.whereEqualTo("oib", oib).get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();
            if (!documents.isEmpty()) {
                QueryDocumentSnapshot document = documents.get(0);
                Boolean voted = document.getBoolean("voted");
                if (voted != null) {
                    return voted;
                } else {
                    System.out.println("Polje 'voted' nije pronađeno za OIB: " + oib);
                    return false;
                }
            } else {
                System.out.println("Dokument sa OIB-om " + oib + " nije pronađen.");
                return false;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return false;
        }
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

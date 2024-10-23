package com.sis.demo.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
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
        CollectionReference oibRef = firestore.collection("candidates");

        try {
            ApiFuture<QuerySnapshot> query = oibRef.get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            for (QueryDocumentSnapshot document : documents) {
                String existingOib = document.getString("oib");
                if (existingOib != null && existingOib.equals(oib)) {
                    return true;
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return false;
    }
}

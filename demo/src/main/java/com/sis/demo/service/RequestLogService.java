package com.sis.demo.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.sis.demo.model.RequestLog;
import com.sis.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RequestLogService {

    private final Firestore firestore;

    @Autowired
    public RequestLogService(Firestore firestore) {
        this.firestore = firestore;
    }
    @Autowired
    JwtUtil jwtUtil;

    public void addRequestLog(RequestLog log) {
        DocumentReference docRef = firestore.collection("requests").document();
        ApiFuture<WriteResult> result = docRef.set(log);
        try {
            System.out.println("Update time : " + result.get().getUpdateTime());

        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public List<RequestLog> getAllRequestLogs() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("request_logs").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<RequestLog> logs = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            logs.add(document.toObject(RequestLog.class));
        }

        return logs;
    }
}

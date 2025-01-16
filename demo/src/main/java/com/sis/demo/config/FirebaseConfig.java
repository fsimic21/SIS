package com.sis.demo.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("sisdb-e2c4e-firebase-adminsdk-flay2-25e36b02c7.json");

        if (serviceAccount == null) {
            throw new FileNotFoundException("Datoteka nije pronađena u resources direktorijumu");
        }


        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            System.out.println("FirebaseApp je inicijalizovan.");
            return FirebaseApp.initializeApp(options);
        } else {
            System.out.println("FirebaseApp je već inicijalizovan.");
            return FirebaseApp.getInstance();
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        System.out.println("FirebaseAuth je inicijalizovan.");
        return FirebaseAuth.getInstance(firebaseApp);
    }

    @Bean
    @DependsOn("initializeFirebase")
    public Firestore firestore() {
        Firestore firestore = FirestoreClient.getFirestore();
        System.out.println("Firestore je inicijalizovan: " + (firestore != null));
        return firestore;
    }
}

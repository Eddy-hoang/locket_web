package com.locket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LocketApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(LocketApplication.class, args);
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════╗\n" +
                "║                                                       ║\n" +
                "║            LOCKET BACKEND STARTED!               ║\n" +
                "║                                                       ║\n" +
                "║   Server running at: http://localhost:8080          ║\n" +
                "║   API Base URL: http://localhost:8080/api           ║\n" +
                "║   Database: MySQL (locket_db)                       ║\n" +
                "║                                                       ║\n" +
                "║   📸 Ready to share photos!                          ║\n" +
                "║                                                       ║\n" +
                "╚═══════════════════════════════════════════════════════╝\n");
    }
}
package com.campusmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot application class for CampusMate Backend
 * 
 * @author CampusMate Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
// @EnableCaching
// @EnableAsync
// @EnableScheduling
@EnableAutoConfiguration(exclude = {SecurityAutoConfiguration.class})
public class CoursemateApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoursemateApplication.class, args);
    }
}

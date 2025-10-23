package com.promptforge.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class TestServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(TestServiceApplication.class, args);
    }
}
package com.gym;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class GymManagementSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(GymManagementSystemApplication.class, args);
    }
}


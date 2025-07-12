package com.stackIt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "com.stackit")
@EntityScan(basePackages = "com.stackit")
public class StackItApplication {

	public static void main(String[] args) {
		SpringApplication.run(StackItApplication.class, args);
	}

}

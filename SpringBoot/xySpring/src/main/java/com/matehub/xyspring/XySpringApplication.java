package com.matehub.xyspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @MapperScan removed because the MyBatis MapperScan annotation is not available on the classpath.
 * If you need automatic mapper scanning, add the MyBatis Spring Boot starter dependency
 * (for example: org.mybatis.spring.boot:mybatis-spring-boot-starter) and restore the annotation.
 */
@SpringBootApplication
public class XySpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(XySpringApplication.class, args);
    }

}

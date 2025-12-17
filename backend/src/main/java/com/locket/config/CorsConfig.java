package com.locket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

        @Value("${cors.allowed-origins}")
        private String allowedOrigins;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // Split origins nếu có nhiều
                configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));

                // Thêm PATCH method
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                // Cho phép tất cả headers
                configuration.setAllowedHeaders(Arrays.asList("*"));

                // Expose Authorization header để frontend đọc token
                configuration.setExposedHeaders(Arrays.asList("Authorization"));

                // Cho phép credentials (cookies, authorization headers)
                configuration.setAllowCredentials(true);

                // Cache preflight request 1 giờ
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}
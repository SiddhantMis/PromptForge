package com.promptforge.prompt.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.media.StringSchema;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI promptServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PromptForge Prompt Service API")
                        .description("Prompt management, versioning, and search service")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Your Name")
                                .email("your.email@example.com")
                                .url("https://github.com/yourusername/promptforge"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .components(new Components()
                        .addParameters("X-User-Id",
                                new Parameter()
                                        .in("header")
                                        .schema(new StringSchema())
                                        .name("X-User-Id")
                                        .description("User ID from JWT token")
                                        .required(false))
                        .addParameters("X-Username",
                                new Parameter()
                                        .in("header")
                                        .schema(new StringSchema())
                                        .name("X-Username")
                                        .description("Username from JWT token")
                                        .required(false)));
    }
}
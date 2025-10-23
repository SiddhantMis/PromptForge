# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Copy parent POM first
COPY pom.xml .
COPY shared-lib ./shared-lib

# Copy this service
COPY user-service ./user-service

# Build from root (includes parent POM)
RUN cd user-service && mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /build/user-service/target/*.jar app.jar

EXPOSE 9001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9001/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
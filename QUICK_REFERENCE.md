# PromptForge - Quick Reference

## Start Infrastructure
cd infrastructure/docker
docker-compose up -d

## Start Microservices
# Terminal 1: API Gateway
cd backend/api-gateway
mvn spring-boot:run

# Terminal 2: User Service
cd backend/user-service
mvn spring-boot:run

# Terminal 3: Prompt Service
cd backend/prompt-service
mvn spring-boot:run

## Test Endpoints
curl http://localhost:8080/actuator/health          # Gateway health
curl http://localhost:8080/api/users/health         # User service via gateway
curl http://localhost:8080/api/prompts/health       # Prompt service via gateway
curl http://localhost:9001/health                   # User service direct
curl http://localhost:9002/health                   # Prompt service direct

## Database Access
# pgAdmin: http://localhost:5050
# Mongo Express: http://localhost:8081
# RedisInsight: http://localhost:5540

## Stop Services
docker-compose down                                 # Stop infrastructure
Ctrl+C in each terminal                            # Stop microservices

## Useful Commands
docker-compose ps                                   # Check container status
docker logs promptforge-postgres                    # View PostgreSQL logs
mvn clean install -DskipTests                      # Build all services
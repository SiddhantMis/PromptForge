#!/bin/bash
echo " Starting PromptForge Complete System..."
echo ""

# Start infrastructure only
echo " Step 1: Starting infrastructure (PostgreSQL, MongoDB, Kafka)..."
docker-compose up -d postgres mongodb zookeeper kafka

echo " Waiting for infrastructure to be healthy (30 seconds)..."
sleep 30

# Build and start services
echo "  Step 2: Building and starting microservices..."
docker-compose up -d --build

echo ""
echo " PromptForge is starting up!"
echo ""
echo " Check status with: docker-compose ps"
echo " View logs with: docker-compose logs -f"
echo ""
echo "🌐 Access Points:"
echo "   - API Gateway: http://localhost:9001"
echo "   - Prompt Service: http://localhost:9002"
echo "   - Test Service: http://localhost:9003"
echo "   - Marketplace: http://localhost:9004"
echo "   - Analytics: http://localhost:9005"
echo ""
echo " Wait 2-3 minutes for all services to start completely!"
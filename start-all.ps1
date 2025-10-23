Write-Host " Starting PromptForge Complete System..." -ForegroundColor Cyan
Write-Host ""

# Start infrastructure only
Write-Host " Step 1: Starting infrastructure (PostgreSQL, MongoDB, Kafka)..." -ForegroundColor Yellow
docker-compose up -d postgres mongodb zookeeper kafka

Write-Host " Waiting for infrastructure to be healthy (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Build and start services
Write-Host "  Step 2: Building and starting microservices..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host ""
Write-Host " PromptForge is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host " Check status with: docker-compose ps" -ForegroundColor Cyan
Write-Host " View logs with: docker-compose logs -f" -ForegroundColor Cyan
Write-Host ""
Write-Host " Access Points:" -ForegroundColor Yellow
Write-Host "   - API Gateway: http://localhost:9001" -ForegroundColor White
Write-Host "   - Prompt Service: http://localhost:9002" -ForegroundColor White
Write-Host "   - Test Service: http://localhost:9003" -ForegroundColor White
Write-Host "   - Marketplace: http://localhost:9004" -ForegroundColor White
Write-Host "   - Analytics: http://localhost:9005" -ForegroundColor White
Write-Host ""
Write-Host " Wait 2-3 minutes for all services to start completely!" -ForegroundColor Green
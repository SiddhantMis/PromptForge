# PromptForge - Complete Service Startup Script
# This script starts all microservices in the correct order

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "    PromptForge Microservices Startup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if PostgreSQL is running
Write-Host "`n[1/6] Checking PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq 'Running') {
    Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL is not running. Please start it manually." -ForegroundColor Red
    Write-Host "  Services required:" -ForegroundColor Yellow
    Write-Host "  - User Service: user_service_db" -ForegroundColor White
    Write-Host "  - Prompt Service: prompt_service_db" -ForegroundColor White
    Write-Host "  - Test Service: test_service_db" -ForegroundColor White
    Write-Host "  - Marketplace Service: marketplace_service_db" -ForegroundColor White
}

# Check if Kafka is running (optional)
Write-Host "`n[2/6] Checking Kafka (optional)..." -ForegroundColor Yellow
Write-Host "ℹ Kafka is optional for basic functionality" -ForegroundColor Gray

Write-Host "`n[3/6] Starting User Service (Port 9002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\user-service'; Write-Host 'Starting User Service...' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "`n[4/6] Starting Prompt Service (Port 9001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\prompt-service'; Write-Host 'Starting Prompt Service...' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "`n[5/6] Starting Test Service (Port 9003)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\test-service'; Write-Host 'Starting Test Service (FIXED VERSION)...' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "`n[6/6] Starting Marketplace Service (Port 9004)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\marketplace-service'; Write-Host 'Starting Marketplace Service...' -ForegroundColor Cyan; mvn spring-boot:run"

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "    All Services Starting..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

Write-Host "`nℹ Each service will open in a new PowerShell window" -ForegroundColor Gray
Write-Host "Wait 30-60 seconds for all services to fully start" -ForegroundColor Gray

Write-Host "`n📍 Service URLs:" -ForegroundColor Cyan
Write-Host "  • User Service:        http://localhost:9002" -ForegroundColor White
Write-Host "  • Prompt Service:      http://localhost:9001" -ForegroundColor White
Write-Host "  • Test Service:        http://localhost:9003" -ForegroundColor White
Write-Host "  • Marketplace Service: http://localhost:9004" -ForegroundColor White

Write-Host "`n📚 Swagger Documentation:" -ForegroundColor Cyan
Write-Host "  • User Service:        http://localhost:9002/swagger-ui.html" -ForegroundColor White
Write-Host "  • Prompt Service:      http://localhost:9001/swagger-ui.html" -ForegroundColor White
Write-Host "  • Test Service:        http://localhost:9003/swagger-ui.html" -ForegroundColor White
Write-Host "  • Marketplace Service: http://localhost:9004/swagger-ui.html" -ForegroundColor White

Write-Host "`n✨ New Features:" -ForegroundColor Cyan
Write-Host "  • Prompt Social Features: /api/social (likes, ratings, comments)" -ForegroundColor White
Write-Host "  • User Follow System: /users/follow, /users/followers, /users/following" -ForegroundColor White
Write-Host "  • Marketplace: /api/marketplace (buy/sell prompts)" -ForegroundColor White
Write-Host "  • AI Testing: /api/tests (test prompts with AI models)" -ForegroundColor White

Write-Host "`n⏱ Waiting 30 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "`n🔍 Checking service health..." -ForegroundColor Yellow

# Check each service
$services = @(
    @{Name="User Service"; Port=9002},
    @{Name="Prompt Service"; Port=9001},
    @{Name="Test Service"; Port=9003},
    @{Name="Marketplace Service"; Port=9004}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/actuator/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ $($service.Name) - HEALTHY" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⏳ $($service.Name) - Still starting..." -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Startup Complete!" -ForegroundColor Green
Write-Host "If any service shows 'Still starting', wait a bit longer and check the individual terminal windows." -ForegroundColor Gray
Write-Host "`nPress any key to exit this startup script (services will continue running)..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


# PromptForge - Service Verification Script
# Tests all endpoints to ensure everything is working

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "    PromptForge Service Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$ErrorActionPreference = "SilentlyContinue"
$allPassed = $true

# Helper function to test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            TimeoutSec = 5
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host "  ✓ $Name" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ✗ $Name - Status: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ✗ $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test User Service
Write-Host "`n[1/4] Testing User Service (Port 9002)..." -ForegroundColor Yellow
$result = Test-Endpoint "Health Check" "http://localhost:9002/actuator/health"
$allPassed = $allPassed -and $result

# Test Prompt Service
Write-Host "`n[2/4] Testing Prompt Service (Port 9001)..." -ForegroundColor Yellow
$result = Test-Endpoint "Health Check" "http://localhost:9001/actuator/health"
$allPassed = $allPassed -and $result
$result = Test-Endpoint "Get Public Prompts" "http://localhost:9001/api/prompts/public"
$allPassed = $allPassed -and $result

# Test Prompt Social Features
Write-Host "`n    Testing Social Features..." -ForegroundColor Cyan
$testPromptId = "test-prompt-123"
$result = Test-Endpoint "Get Prompt Stats" "http://localhost:9001/api/social/stats/$testPromptId"
$allPassed = $allPassed -and $result

# Test Test Service (FIXED VERSION)
Write-Host "`n[3/4] Testing Test Service (Port 9003) - FIXED..." -ForegroundColor Yellow
$result = Test-Endpoint "Health Check" "http://localhost:9003/actuator/health"
$allPassed = $allPassed -and $result
$result = Test-Endpoint "Get Available Providers" "http://localhost:9003/api/tests/providers"
$allPassed = $allPassed -and $result

# Test creating a test
Write-Host "`n    Testing AI Test Execution..." -ForegroundColor Cyan
$testBody = @{
    promptId = "test-prompt-123"
    promptContent = "Write a haiku about coding"
    modelProvider = "MOCK"
    modelName = "mock-model"
    temperature = 0.7
    maxTokens = 1000
} | ConvertTo-Json

$result = Test-Endpoint "Create Test" "http://localhost:9003/api/tests" "POST" @{"X-User-Id"="test-user-123"} $testBody
$allPassed = $allPassed -and $result

if ($result) {
    Write-Host "    ✓ Test Service Parameter Name Bug FIXED!" -ForegroundColor Green
}

# Test Marketplace Service
Write-Host "`n[4/4] Testing Marketplace Service (Port 9004)..." -ForegroundColor Yellow
$result = Test-Endpoint "Health Check" "http://localhost:9004/actuator/health"
$allPassed = $allPassed -and $result
$result = Test-Endpoint "Get Active Listings" "http://localhost:9004/api/marketplace/listings"
$allPassed = $allPassed -and $result

# Summary
Write-Host "`n==================================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "    ✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "    All services are running correctly!" -ForegroundColor Green
} else {
    Write-Host "    ⚠ SOME TESTS FAILED" -ForegroundColor Yellow
    Write-Host "    Check the individual service logs above" -ForegroundColor Yellow
}
Write-Host "==================================================" -ForegroundColor Cyan

Write-Host "`n📊 Service Status Summary:" -ForegroundColor Cyan
Write-Host "  • User Service: " -NoNewline
Test-Endpoint "Check" "http://localhost:9002/actuator/health" | Out-Null

Write-Host "  • Prompt Service (with Social Features): " -NoNewline
Test-Endpoint "Check" "http://localhost:9001/actuator/health" | Out-Null

Write-Host "  • Test Service (FIXED): " -NoNewline
Test-Endpoint "Check" "http://localhost:9003/actuator/health" | Out-Null

Write-Host "  • Marketplace Service: " -NoNewline
Test-Endpoint "Check" "http://localhost:9004/actuator/health" | Out-Null

Write-Host "`n📚 Quick Reference:" -ForegroundColor Cyan
Write-Host "  • View Swagger UI for any service at: http://localhost:PORT/swagger-ui.html" -ForegroundColor White
Write-Host "  • Social endpoints: /api/social/*" -ForegroundColor White
Write-Host "  • Follow endpoints: /users/follow/*" -ForegroundColor White
Write-Host "  • Marketplace endpoints: /api/marketplace/*" -ForegroundColor White
Write-Host "  • Test endpoints: /api/tests/*" -ForegroundColor White

Write-Host "`n"


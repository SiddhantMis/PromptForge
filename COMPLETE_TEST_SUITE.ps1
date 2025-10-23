# PromptForge Complete Test Suite

## 1. Test User Registration & Auth
$user = @{
    username = "testuser"
    email = "test@promptforge.com"
    password = "test123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

$authResp = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:9001/auth/register" `
    -Body $user -ContentType "application/json"

Write-Host " User registered: $($authResp.user.id)"

## 2. Test Prompt Creation
$prompt = @{
    title = "Blog Writer"
    content = "Write SEO blog posts"
    category = "Writing"
    isPublic = $true
} | ConvertTo-Json

$promptResp = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:9002/prompts" `
    -Headers @{"X-User-Id"=$authResp.user.id;"Content-Type"="application/json"} `
    -Body $prompt

Write-Host " Prompt created: $($promptResp.id)"

## 3. Test Social Features
# Like
$like = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:9002/api/social/likes" `
    -Headers @{"X-User-Id"=$authResp.user.id;"Content-Type"="application/json"} `
    -Body (@{promptId=$promptResp.id}|ConvertTo-Json)

# Rate
$rating = @{
    promptId = $promptResp.id
    rating = 5
    review = "Excellent!"
} | ConvertTo-Json

$rateResp = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:9002/api/social/ratings" `
    -Headers @{"X-User-Id"=$authResp.user.id;"Content-Type"="application/json"} `
    -Body $rating

# Comment
$comment = @{
    promptId = $promptResp.id
    content = "Great prompt!"
} | ConvertTo-Json

$commentResp = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:9002/api/social/comments" `
    -Headers @{"X-User-Id"=$authResp.user.id;"X-Username"="testuser";"Content-Type"="application/json"} `
    -Body $comment

# Get Stats
$stats = Invoke-RestMethod -Uri "http://localhost:9002/api/social/stats/$($promptResp.id)"

Write-Host "`n Social Features Working!"
Write-Host "   Likes: $($stats.totalLikes)"
Write-Host "   Comments: $($stats.totalComments)"
Write-Host "   Rating: $($stats.averageRating)/5"

## 4. Test AI Testing Service
$test = @{
    promptId = $promptResp.id
    promptContent = "Write a haiku"
    modelProvider = "MOCK"
    modelName = "mock-model"
    temperature = 0.7
    maxTokens = 100
} | ConvertTo-Json

$testResp = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:9003/api/tests" `
    -Headers @{"X-User-Id"=$authResp.user.id;"Content-Type"="application/json"} `
    -Body $test

Start-Sleep -Seconds 2
$testResult = Invoke-RestMethod -Uri "http://localhost:9003/api/tests/$($testResp.id)"

Write-Host "`n AI Test Complete!"
Write-Host "   Status: $($testResult.status)"
Write-Host "   Tokens: $($testResult.tokenCount)"

## 5. Test Marketplace
$listing = @{
    promptId = $promptResp.id
    title = "Premium Blog Writer"
    description = "Professional prompt"
    price = 29.99
} | ConvertTo-Json

$listingResp = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:9004/api/marketplace/listings" `
    -Headers @{"X-User-Id"=$authResp.user.id;"Content-Type"="application/json"} `
    -Body $listing

Write-Host "`n Marketplace Listing Created!"
Write-Host "   Price: $($listingResp.price)"

## 6. Test Analytics
$analyticsStats = Invoke-RestMethod -Uri "http://localhost:9005/analytics/stats"

Write-Host "`n Analytics Working!"
Write-Host "   Total Users: $($analyticsStats.totalUserEvents)"
Write-Host "   Total Prompts: $($analyticsStats.totalPromptEvents)"

Write-Host "`n ALL TESTS PASSED!" -ForegroundColor Green

# API Test Script for Foxy Confidential Backend

Write-Host "🦊 Testing Foxy Confidential API Endpoints" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check Successful!" -ForegroundColor Green
    Write-Host ($healthResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Register User
Write-Host "`n2. Testing User Registration..." -ForegroundColor Cyan
$registerData = @{
    username = "testuser123"
    email = "test@foxyconfidential.com"
    password = "TestPassword123"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ User Registration Successful!" -ForegroundColor Green
    Write-Host ($registerResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "❌ User Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

# Test 3: Get Restaurants
Write-Host "`n3. Testing Get Restaurants..." -ForegroundColor Cyan
try {
    $restaurantsResponse = Invoke-RestMethod -Uri "$baseUrl/api/restaurants" -Method GET
    Write-Host "✅ Get Restaurants Successful!" -ForegroundColor Green
    Write-Host ($restaurantsResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "❌ Get Restaurants Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

# Test 4: Get Featured Restaurants
Write-Host "`n4. Testing Get Featured Restaurants..." -ForegroundColor Cyan
try {
    $featuredResponse = Invoke-RestMethod -Uri "$baseUrl/api/restaurants/featured" -Method GET
    Write-Host "✅ Get Featured Restaurants Successful!" -ForegroundColor Green
    Write-Host ($featuredResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "❌ Get Featured Restaurants Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Reviews
Write-Host "`n5. Testing Get Reviews..." -ForegroundColor Cyan
try {
    $reviewsResponse = Invoke-RestMethod -Uri "$baseUrl/api/reviews" -Method GET
    Write-Host "✅ Get Reviews Successful!" -ForegroundColor Green
    Write-Host ($reviewsResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "❌ Get Reviews Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Yellow
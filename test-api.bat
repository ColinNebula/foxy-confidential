@echo off
echo Testing Foxy Confidential API...
echo.

echo Starting test server...
start /B node "Z:\Directory\projects\foxy-confidential\server\test-server.js"

echo Waiting for server to start...
timeout /t 3 > nul

echo.
echo Testing endpoints...
echo.

echo 1. Health Check:
curl -s http://localhost:3001/health
echo.
echo.

echo 2. Get Restaurants:
curl -s http://localhost:3001/api/restaurants
echo.
echo.

echo 3. Register User:
curl -s -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"Test123\",\"first_name\":\"Test\",\"last_name\":\"User\"}"
echo.
echo.

echo API Testing Complete!
pause
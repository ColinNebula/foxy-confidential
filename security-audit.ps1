# Security Audit Script for Foxy Confidential (PowerShell)
# Run this script before pushing to GitHub or deploying

Write-Host "Security Audit for Foxy Confidential" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$Errors = 0
$Warnings = 0

function Print-Section {
    param([string]$Message)
    Write-Host ""
    Write-Host "> $Message" -ForegroundColor Blue
    Write-Host "--------------------------------------" -ForegroundColor Blue
}

function Print-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Print-Warning {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
    $script:Warnings++
}

function Print-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
    $script:Errors++
}

# Check 1: Environment Files
Print-Section "1. Checking Environment Files"

if (-not (Test-Path ".env")) {
    Print-Error ".env file missing! Copy from .env.example"
} else {
    Print-Success ".env file exists"
    
    if (Select-String -Path ".gitignore" -Pattern "^\.env$" -Quiet) {
        Print-Success ".env is in .gitignore"
    } else {
        Print-Error ".env is NOT in .gitignore!"
    }
}

if (-not (Test-Path ".env.example")) {
    Print-Warning ".env.example missing (recommended for documentation)"
} else {
    Print-Success ".env.example exists"
}

if (Test-Path "server/.env") {
    Print-Success "server/.env exists"
    if (Select-String -Path ".gitignore" -Pattern "^server/\.env$" -Quiet) {
        Print-Success "server/.env is in .gitignore"
    } else {
        Print-Error "server/.env is NOT in .gitignore!"
    }
} else {
    Print-Warning "server/.env missing"
}

# Check 2: Git Repository
Print-Section "2. Checking Git Repository"

try {
    git ls-files --error-unmatch .env 2>$null
    if ($LASTEXITCODE -eq 0) {
        Print-Error ".env is tracked by Git! Remove it: git rm --cached .env"
    } else {
        Print-Success ".env is not tracked by Git"
    }
} catch {
    Print-Success ".env is not tracked by Git"
}

try {
    git ls-files --error-unmatch server/.env 2>$null
    if ($LASTEXITCODE -eq 0) {
        Print-Error "server/.env is tracked by Git! Remove it: git rm --cached server/.env"
    } else {
        Print-Success "server/.env is not tracked by Git"
    }
} catch {
    Print-Success "server/.env is not tracked by Git"
}

# Check 3: Dependencies
Print-Section "3. Checking Dependencies"

if (Test-Path "package.json") {
    Print-Success "package.json found"
    
    Write-Host "  Running npm audit..." -ForegroundColor Gray
    $auditResult = npm audit --audit-level=moderate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Print-Success "No moderate+ vulnerabilities found"
    } else {
        Print-Error "Vulnerabilities found! Run: npm audit fix"
    }
    
    $outdated = npm outdated 2>$null
    if ($outdated) {
        $count = ($outdated -split "`n").Count - 1
        Print-Warning "$count packages are outdated"
        Write-Host "  Run: npm outdated to see details" -ForegroundColor Gray
    } else {
        Print-Success "All packages are up to date"
    }
} else {
    Print-Error "package.json not found!"
}

# Check server dependencies
if (Test-Path "server/package.json") {
    Print-Success "server/package.json found"
    Push-Location server
    Write-Host "  Running server npm audit..." -ForegroundColor Gray
    $serverAudit = npm audit --audit-level=moderate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Print-Success "No moderate+ vulnerabilities in server"
    } else {
        Print-Error "Server vulnerabilities found! Run: cd server && npm audit fix"
    }
    Pop-Location
}

# Check 4: Code Quality
Print-Section "4. Checking Code Quality"

$consoleLogCount = 0
Get-ChildItem -Path "src" -Include "*.js","*.jsx" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $consoleLogCount += (Select-String -Path $_.FullName -Pattern "console\.log" -AllMatches).Matches.Count
}

if ($consoleLogCount -gt 0) {
    Print-Warning "Found $consoleLogCount console.log statements"
    Write-Host "  Consider removing or replacing with proper logging" -ForegroundColor Gray
} else {
    Print-Success "No console.log statements found"
}

$debuggerMatches = Get-ChildItem -Path "src" -Include "*.js","*.jsx" -Recurse -ErrorAction SilentlyContinue | Select-String -Pattern "^\s*debugger\s*;"
if ($debuggerMatches) {
    Print-Error "Debugger statements found!"
    $debuggerMatches | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }
} else {
    Print-Success "No debugger statements found"
}

# Check 5: File Sizes
Print-Section "5. Checking File Sizes"

$largeFiles = Get-ChildItem -Path "." -File -Recurse -ErrorAction SilentlyContinue | 
    Where-Object { $_.Length -gt 1MB -and $_.FullName -notmatch "node_modules|\.git|build|dist" }

if ($largeFiles) {
    Print-Warning "Large files found (>1MB):"
    $largeFiles | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "    $($_.FullName) ($sizeMB MB)" -ForegroundColor Yellow
    }
    Write-Host "  Consider using Git LFS or external hosting" -ForegroundColor Gray
} else {
    Print-Success "No large files found"
}

# Check 6: Security Configuration
Print-Section "6. Checking Server Security Configuration"

if (Test-Path "server/server.js") {
    $serverContent = Get-Content "server/server.js" -Raw
    
    if ($serverContent -match "helmet") {
        Print-Success "Helmet.js security headers detected"
    } else {
        Print-Warning "Helmet.js not found in server.js"
    }
    
    if ($serverContent -match "cors") {
        Print-Success "CORS configuration detected"
    } else {
        Print-Warning "CORS not configured"
    }
    
    if ($serverContent -match "rate-?limit|rateLimit") {
        Print-Success "Rate limiting detected"
    } else {
        Print-Warning "Rate limiting not found"
    }
}

# Check 7: .gitignore
Print-Section "7. Checking .gitignore Configuration"

if (Test-Path ".gitignore") {
    Print-Success ".gitignore exists"
    
    $importantEntries = @("node_modules", ".env", "build", "dist")
    foreach ($entry in $importantEntries) {
        if (Select-String -Path ".gitignore" -Pattern "^$entry" -Quiet) {
            Print-Success "$entry is in .gitignore"
        } else {
            Print-Error "$entry is NOT in .gitignore"
        }
    }
} else {
    Print-Error ".gitignore missing!"
}

# Summary
Print-Section "SECURITY AUDIT SUMMARY"
Write-Host ""

if ($Errors -eq 0 -and $Warnings -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "[PASS] All checks passed! Ready to push." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    exit 0
} elseif ($Errors -eq 0) {
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "[WARN] $Warnings warnings found" -ForegroundColor Yellow
    Write-Host "Review warnings before pushing." -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "[FAIL] $Errors errors and $Warnings warnings found" -ForegroundColor Red
    Write-Host "Fix errors before pushing!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    exit 1
}

#!/bin/bash

# Security Audit Script for Foxy Confidential
# Run this script before pushing to GitHub or deploying

echo "🔒 Starting Security Audit for Foxy Confidential"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo "──────────────────────────────────────"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

# Check 1: Environment Files
print_section "1. Checking Environment Files"

if [ ! -f ".env" ]; then
    print_error ".env file missing! Copy from .env.example"
else
    print_success ".env file exists"
    
    # Check if .env is in .gitignore
    if grep -q "^\.env$" .gitignore; then
        print_success ".env is in .gitignore"
    else
        print_error ".env is NOT in .gitignore!"
    fi
fi

if [ ! -f ".env.example" ]; then
    print_warning ".env.example missing (recommended for documentation)"
else
    print_success ".env.example exists"
fi

# Check server .env
if [ -f "server/.env" ]; then
    print_success "server/.env exists"
    if grep -q "^server/\.env$" .gitignore; then
        print_success "server/.env is in .gitignore"
    else
        print_error "server/.env is NOT in .gitignore!"
    fi
else
    print_warning "server/.env missing"
fi

# Check 2: Git Repository
print_section "2. Checking Git Repository"

# Check if .env files are tracked
if git ls-files --error-unmatch .env 2>/dev/null; then
    print_error ".env is tracked by Git! Remove it: git rm --cached .env"
else
    print_success ".env is not tracked by Git"
fi

if git ls-files --error-unmatch server/.env 2>/dev/null; then
    print_error "server/.env is tracked by Git! Remove it: git rm --cached server/.env"
else
    print_success "server/.env is not tracked by Git"
fi

# Check for secrets in Git history
print_section "3. Scanning for Secrets in Git History"
SECRETS_FOUND=0
SECRET_PATTERNS=("password" "secret" "api_key" "token" "private_key")

for pattern in "${SECRET_PATTERNS[@]}"; do
    if git log --all -p | grep -qi "$pattern" | head -n 1; then
        print_warning "Pattern '$pattern' found in Git history"
        ((SECRETS_FOUND++))
    fi
done

if [ $SECRETS_FOUND -eq 0 ]; then
    print_success "No obvious secrets found in Git history"
else
    print_warning "$SECRETS_FOUND potential secret patterns found in Git history"
    echo "  Consider using tools like git-filter-branch or BFG Repo-Cleaner"
fi

# Check 4: Dependencies
print_section "4. Checking Dependencies"

if [ -f "package.json" ]; then
    print_success "package.json found"
    
    # Check for npm audit
    echo "  Running npm audit..."
    if npm audit --audit-level=moderate > /dev/null 2>&1; then
        print_success "No moderate+ vulnerabilities found"
    else
        print_error "Vulnerabilities found! Run: npm audit fix"
    fi
    
    # Check for outdated packages
    OUTDATED=$(npm outdated 2>/dev/null | tail -n +2 | wc -l)
    if [ "$OUTDATED" -gt 0 ]; then
        print_warning "$OUTDATED packages are outdated"
        echo "  Run: npm outdated to see details"
    else
        print_success "All packages are up to date"
    fi
else
    print_error "package.json not found!"
fi

# Check server dependencies
if [ -f "server/package.json" ]; then
    print_success "server/package.json found"
    cd server
    echo "  Running server npm audit..."
    if npm audit --audit-level=moderate > /dev/null 2>&1; then
        print_success "No moderate+ vulnerabilities in server"
    else
        print_error "Server vulnerabilities found! Run: cd server && npm audit fix"
    fi
    cd ..
fi

# Check 5: Code Quality
print_section "5. Checking Code Quality"

# Check for console.log
LOG_COUNT=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -c "console\.log" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')
if [ "$LOG_COUNT" -gt 0 ]; then
    print_warning "Found $LOG_COUNT console.log statements"
    echo "  Consider removing or replacing with proper logging"
else
    print_success "No console.log statements found"
fi

# Check for debugger
if find src -name "*.js" -o -name "*.jsx" | xargs grep -q "debugger" 2>/dev/null; then
    print_error "Debugger statements found!"
else
    print_success "No debugger statements found"
fi

# Check for hardcoded URLs
if find src -name "*.js" -o -name "*.jsx" | xargs grep -E "http://localhost|http://127.0.0.1" 2>/dev/null | grep -qv "example\|test"; then
    print_warning "Hardcoded localhost URLs found"
    echo "  Consider using environment variables"
else
    print_success "No hardcoded localhost URLs found"
fi

# Check 6: File Sizes
print_section "6. Checking File Sizes"

LARGE_FILES=$(find . -type f -size +1M ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/build/*" ! -path "*/dist/*" 2>/dev/null)
if [ -n "$LARGE_FILES" ]; then
    print_warning "Large files found (>1MB):"
    echo "$LARGE_FILES" | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "    $file ($size)"
    done
    echo "  Consider using Git LFS or external hosting"
else
    print_success "No large files found"
fi

# Check 7: Security Headers
print_section "7. Checking Server Security Configuration"

if [ -f "server/server.js" ]; then
    if grep -q "helmet" server/server.js; then
        print_success "Helmet.js security headers detected"
    else
        print_warning "Helmet.js not found in server.js"
    fi
    
    if grep -q "cors" server/server.js; then
        print_success "CORS configuration detected"
    else
        print_warning "CORS not configured"
    fi
    
    if grep -q "rate-limit\|rateLimit" server/server.js; then
        print_success "Rate limiting detected"
    else
        print_warning "Rate limiting not found"
    fi
fi

# Check 8: Database Security
print_section "8. Checking Database Configuration"

if [ -f "server/config/database.js" ]; then
    if grep -q "process.env" server/config/database.js; then
        print_success "Database uses environment variables"
    else
        print_error "Database credentials may be hardcoded!"
    fi
fi

# Check 9: Authentication
print_section "9. Checking Authentication Security"

if [ -f "server/middleware/auth.js" ]; then
    print_success "Authentication middleware found"
    
    if grep -q "jwt" server/middleware/auth.js; then
        print_success "JWT authentication detected"
    fi
    
    if grep -q "bcrypt" server/controllers/authController.js 2>/dev/null; then
        print_success "Password hashing (bcrypt) detected"
    else
        print_warning "Password hashing not confirmed"
    fi
fi

# Check 10: Build Configuration
print_section "10. Checking Build Configuration"

if [ -f ".gitignore" ]; then
    print_success ".gitignore exists"
    
    # Check important entries
    IMPORTANT_ENTRIES=("node_modules" ".env" "build" "dist")
    for entry in "${IMPORTANT_ENTRIES[@]}"; do
        if grep -q "^$entry" .gitignore; then
            print_success "$entry is in .gitignore"
        else
            print_error "$entry is NOT in .gitignore"
        fi
    done
else
    print_error ".gitignore missing!"
fi

# Summary
print_section "SECURITY AUDIT SUMMARY"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ All checks passed! Ready to push.${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠️  $WARNINGS warnings found${NC}"
    echo -e "${YELLOW}Review warnings before pushing.${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ $ERRORS errors and $WARNINGS warnings found${NC}"
    echo -e "${RED}Fix errors before pushing!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi

# 🚀 Quick Security Checklist

## Before Every Commit

```bash
# Run security audit
npm run security-check

# OR manually:
./security-audit.sh          # Unix/Linux/Mac
.\security-audit.ps1         # Windows PowerShell
```

## ✅ Security Checklist

### Environment Setup
- [ ] `.env` files created from `.env.example`
- [ ] `.env` files are in `.gitignore`
- [ ] `.env` files are NOT tracked by Git
- [ ] All API keys and secrets in `.env`
- [ ] No hardcoded secrets in code

### Git Security
- [ ] Pre-commit hook installed (`.git/hooks/pre-commit`)
- [ ] `.gitignore` includes sensitive files
- [ ] No `.env` files in Git history
- [ ] Large files excluded or using Git LFS

### Dependencies
- [ ] `npm audit` shows no high vulnerabilities
- [ ] Dependencies are up to date
- [ ] No deprecated packages

### Code Quality
- [ ] No `console.log` in production code
- [ ] No `debugger` statements
- [ ] No hardcoded URLs
- [ ] Environment variables used correctly

### Backend Security
- [ ] Helmet.js enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation on all routes
- [ ] Passwords hashed with bcrypt
- [ ] JWT secrets are strong (64+ chars)

### Database
- [ ] Database credentials in `.env`
- [ ] Connection pooling configured
- [ ] Using prepared statements
- [ ] Database user has minimal privileges

## 🔑 Generate Secure Secrets

```bash
# JWT Secret (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Session Secret (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Random Password (32 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex').slice(0,32))"
```

## 🚨 Emergency: Remove Committed Secrets

```bash
# Remove file from Git but keep locally
git rm --cached .env

# Remove from history (DANGEROUS - rewrites history)
# git filter-branch --force --index-filter \
#   "git rm --cached --ignore-unmatch .env" \
#   --prune-empty --tag-name-filter cat -- --all

# Force push (if you've already pushed)
# git push origin --force --all
```

## 📦 Quick Commands

```bash
# Security audit
npm run audit-security

# Fix vulnerabilities
npm audit fix

# Check for updates
npm outdated

# Clean install
npm run reinstall

# Test environment
npm run check-env
```

## 🔍 Common Issues

### "Module not found" after pulling
```bash
npm install
cd server && npm install
```

### Environment variables not loading
```bash
# Check .env exists
ls -la .env

# Restart dev server
npm start
```

### Git shows .env changes
```bash
# Unstage .env
git reset HEAD .env

# Verify it's ignored
git check-ignore -v .env
```

## 📱 Production Deployment

### Pre-Deployment
1. Run `./security-audit.sh`
2. Run `npm run build`
3. Test build locally
4. Set environment variables in hosting platform
5. Enable HTTPS
6. Configure domain and CORS

### Post-Deployment
1. Verify HTTPS works
2. Test all functionality
3. Check error logs
4. Monitor performance
5. Set up alerts

## 🛡️ Security Monitoring

```bash
# Check for vulnerabilities daily
npm audit

# Update dependencies monthly
npm update

# Rotate secrets quarterly
# - Generate new JWT_SECRET
# - Update in .env
# - Deploy
```

## 📚 Resources

- [SECURITY.md](./SECURITY.md) - Full security policy
- [SETUP.md](./SETUP.md) - Setup guide
- [.env.example](./.env.example) - Environment template
- [Git Hooks](./.git-hooks/README.md) - Hook documentation

## 🆘 Need Help?

- Review logs: Check browser console and server logs
- Run audit: `./security-audit.sh`
- Check docs: Read SECURITY.md and SETUP.md
- Ask for help: Open an issue on GitHub

---

**Remember:** Security is everyone's responsibility! 🔐

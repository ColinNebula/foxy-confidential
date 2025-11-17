# 🔐 Git Hooks Installation Guide

This directory contains Git hooks to enhance security and code quality.

## Installation

### Automatic Installation (Recommended)

Run this command from the project root:

```bash
# Unix/Linux/Mac
chmod +x .git-hooks/pre-commit
cp .git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Windows (PowerShell)
Copy-Item .git-hooks\pre-commit .git\hooks\pre-commit
```

### Manual Installation

1. Copy the pre-commit file to `.git/hooks/`
2. Make it executable: `chmod +x .git/hooks/pre-commit`
3. Test it: `git commit --allow-empty -m "test"`

## What the Pre-Commit Hook Does

### 🚫 Prevents:
- Committing `.env` files
- Committing files with hardcoded secrets (passwords, API keys)
- Committing `debugger` statements
- Committing files larger than 1MB
- Committing code with high-severity vulnerabilities

### ⚠️ Warns About:
- Potential secrets in code
- `console.log` statements
- Hardcoded localhost URLs
- Mismatched .env and .env.example keys

## Bypassing the Hook (Emergency Only)

If you absolutely must bypass the hook:

```bash
git commit --no-verify -m "your message"
```

⚠️ **WARNING:** Only use this in emergencies! Always fix the issues instead.

## Testing the Hook

```bash
# Create a test file with a secret
echo "const apiKey = 'secret_key_123'" > test.js
git add test.js
git commit -m "test"  # Should be blocked

# Clean up
rm test.js
git reset HEAD test.js
```

## Customization

Edit `.git-hooks/pre-commit` to:
- Add more patterns to detect
- Adjust file size limits
- Add custom checks
- Modify warning messages

## Troubleshooting

### Hook not running:
```bash
# Check if hook is executable
ls -la .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
```

### Hook running but not working:
```bash
# Verify hook location
cat .git/hooks/pre-commit

# Re-copy from template
cp .git-hooks/pre-commit .git/hooks/pre-commit
```

## Additional Security Tools

Consider using these tools with the hooks:

- **git-secrets**: Prevents committing secrets
  ```bash
  brew install git-secrets
  git secrets --install
  git secrets --register-aws
  ```

- **husky**: Git hooks manager
  ```bash
  npm install -D husky
  npx husky install
  ```

- **lint-staged**: Run linters on staged files
  ```bash
  npm install -D lint-staged
  ```

## Best Practices

1. ✅ Always use environment variables for secrets
2. ✅ Review changes before committing
3. ✅ Run security audits regularly
4. ✅ Keep .env.example up to date
5. ✅ Never bypass hooks without review

## Resources

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Security Best Practices](../SECURITY.md)
- [Setup Guide](../SETUP.md)

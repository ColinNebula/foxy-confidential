# Foxy Confidential - Setup Guide

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- MySQL 8.x or higher (for backend)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/foxy-confidential.git
cd foxy-confidential
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Add your Google Maps API key and other settings
nano .env
```

#### Required Environment Variables:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

#### Required Environment Variables:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=foxy_confidential
JWT_SECRET=your_generated_secret_key
```

### 4. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE foxy_confidential;

# Run migrations (from server directory)
mysql -u root -p foxy_confidential < config/database.sql
```

### 5. Generate Secure Secrets

```bash
# Generate JWT secret (minimum 64 characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and add to your .env files
```

### 6. Start Development Servers

#### Terminal 1 - Frontend:
```bash
npm start
# App runs on http://localhost:3000
```

#### Terminal 2 - Backend:
```bash
cd server
npm run dev
# API runs on http://localhost:5000
```

## 🔐 Security Setup

### 1. Protect Your Secrets

✅ **DO:**
- Use `.env` files for all secrets
- Generate strong, random secrets
- Keep `.env` files local only
- Use different secrets for dev/prod

❌ **DON'T:**
- Commit `.env` files to Git
- Share API keys publicly
- Use default passwords
- Hardcode secrets in code

### 2. Verify .gitignore

```bash
# Check that .env is ignored
git check-ignore -v .env
git check-ignore -v server/.env

# Should output: .gitignore:XX:.env
```

### 3. Security Checklist

```bash
# Install dependencies
npm install

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for updates
npm outdated
```

## 📦 Build for Production

### Frontend Build:
```bash
# Create optimized production build
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### Backend Production:
```bash
cd server

# Set production environment
export NODE_ENV=production

# Start server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Backend tests
cd server
npm test
```

## 📝 Environment Variables Reference

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| REACT_APP_GOOGLE_MAPS_API_KEY | Google Maps API key | Yes |
| REACT_APP_API_URL | Backend API URL | Yes |
| REACT_APP_USE_MOCK_DATA | Use mock data (dev) | No |

### Backend (server/.env)
| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | Yes |
| DB_HOST | Database host | Yes |
| DB_USER | Database user | Yes |
| DB_PASSWORD | Database password | Yes |
| DB_NAME | Database name | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| CORS_ORIGIN | Allowed origins | Yes |

## 🐛 Troubleshooting

### "Cannot find module" errors:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors:
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'foxy_confidential'"

# Check credentials in .env
cat server/.env | grep DB_
```

### Port already in use:
```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 5000 (backend)
npx kill-port 5000
```

### Environment variables not loading:
```bash
# Verify .env exists
ls -la .env server/.env

# Check .env syntax (no spaces around =)
cat .env

# Restart development server
npm start
```

## 📱 PWA Setup

The app is configured as a Progressive Web App:

1. Build production version: `npm run build`
2. Serve over HTTPS
3. Manifest file: `public/manifest.json`
4. Service worker: `src/service-worker.js`

## 🌐 Deployment

### Vercel (Frontend):
```bash
npm install -g vercel
vercel login
vercel

# Add environment variables in Vercel dashboard
```

### Heroku (Backend):
```bash
cd server
heroku login
heroku create foxy-confidential-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Environment Variables in Production:
```bash
# Set in hosting platform dashboard or CLI:
- REACT_APP_GOOGLE_MAPS_API_KEY
- REACT_APP_API_URL
- JWT_SECRET (64+ characters)
- DB_PASSWORD (16+ characters)
- All other secrets from .env.example
```

## 🔒 Security Best Practices

1. **Never commit secrets** - Use `.env` files
2. **Use strong passwords** - Minimum 16 characters
3. **Enable HTTPS** - Always in production
4. **Update dependencies** - Run `npm audit` regularly
5. **Rotate secrets** - Every 90 days
6. **Monitor logs** - Check for suspicious activity
7. **Backup database** - Regular automated backups

## 📚 Documentation

- [Backend Setup](BACKEND_SETUP.md)
- [Google Maps Setup](GOOGLE_MAPS_SETUP.md)
- [Security Policy](SECURITY.md)
- [Troubleshooting](TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and security audits
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@foxyconfidential.com
- Check documentation: [Wiki](https://github.com/yourusername/foxy-confidential/wiki)

---

**Happy Coding! 🦊**

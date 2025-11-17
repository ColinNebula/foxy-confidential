# Foxy Confidential - Restaurant Discovery Platform 🦊

> A modern, secure, and full-featured restaurant discovery and review platform with interactive maps, advanced filtering, and comprehensive review system.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933.svg)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-Hardened-success.svg)](./SECURITY.md)

## 🌟 Features

### 🗺️ Interactive Dashboard
- **Interactive Maps** - Enhanced Leaflet maps with search, legend, and multiple map styles
- **Location-Based Search** - Automatic GPS detection with accuracy radius
- **Advanced Filtering** - Filter by cuisine, rating, price range, and distance radius
- **Dual View Modes** - Toggle between interactive map and grid list views
- **Live Statistics** - Real-time metrics on restaurants, cuisines, and ratings
- **Collapsible Info Overlay** - Clean map interface with toggleable information

### ⭐ Enhanced Reviews System
- **Comprehensive Reviews** - Multi-category rating system (food, taste, ambiance, creativity, uniqueness)
- **Service Ratings** - Rate speed, friendliness, knowledge, and attentiveness
- **Image Gallery** - Upload and view multiple review photos
- **Advanced Filters** - Filter by rating ranges, date periods, verified status
- **Statistics Dashboard** - Visual rating distribution and review analytics
- **Search & Sort** - Powerful search with multiple sorting options

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Beautiful frosted glass effects throughout
- **Smooth Animations** - Fluid transitions and hover effects
- **Responsive Layout** - Perfect on desktop, tablet, and mobile
- **Dark Theme** - Eye-friendly dark interface with vibrant accents
- **Interactive Elements** - Engaging buttons, cards, and controls
- **PWA Ready** - Progressive Web App with offline support

### 🔐 Security Features
- **Environment Variables** - All secrets stored securely in `.env` files
- **Input Validation** - Express Validator for backend security
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Protection against DDoS and brute force
- **Security Headers** - Helmet.js for comprehensive security headers
- **SQL Injection Protection** - Parameterized queries throughout
- **XSS Prevention** - Input sanitization and output escaping
- **Pre-commit Hooks** - Automatic security checks before commits

### 🔧 Backend Integration (MySQL)
- **RESTful API** - Complete Express.js backend
- **MySQL Database** - Robust data storage with optimized schema
- **User Management** - Registration, login, and profile management
- **Admin Features** - Restaurant and review management
- **Connection Pooling** - Optimized database performance

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- MySQL 8.x or higher (for backend features)
- Google Maps API key (optional, for production)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ColinNebula/foxy-confidential.git
cd foxy-confidential
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

3. **Configure Environment Variables**
```bash
# Copy environment templates
cp .env.example .env
cp server/.env.example server/.env

# Edit .env files with your configuration
# IMPORTANT: Never commit .env files to Git!
```

**Required Environment Variables:**
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Get from [Google Cloud Console](https://console.cloud.google.com/)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)
- `JWT_SECRET` - Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `DB_PASSWORD` - Your MySQL root password

4. **Set up Database**
```bash
# Create MySQL database
mysql -u root -p

CREATE DATABASE foxy_confidential;
exit;

# Import schema
cd server
mysql -u root -p foxy_confidential < config/database.sql
```

5. **Run Security Audit**
```bash
# Unix/Linux/Mac
chmod +x security-audit.sh
./security-audit.sh

# Windows PowerShell
.\security-audit.ps1
```

6. **Start Development Servers**

**Terminal 1 - Frontend:**
```bash
npm start
# Opens http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

## 🔐 Security

This project implements comprehensive security measures:

- ✅ **Environment Variables** - All secrets in `.env` files
- ✅ **Git Ignore** - Sensitive files excluded from Git
- ✅ **Pre-commit Hooks** - Automatic security scans
- ✅ **Dependency Audits** - Regular vulnerability checks
- ✅ **Input Validation** - All user inputs sanitized
- ✅ **Rate Limiting** - DDoS and brute force protection
- ✅ **Security Headers** - Helmet.js configuration
- ✅ **JWT Tokens** - Secure authentication
- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **SQL Protection** - Parameterized queries only

**Read more:** [SECURITY.md](./SECURITY.md) | [Security Checklist](./SECURITY_CHECKLIST.md)

### Quick Security Check
```bash
# Run comprehensive security audit
npm run security-check

# Audit dependencies
npm audit

# Check for outdated packages
npm outdated
```

## 📱 Pages & Features

### Dashboard
Navigate to the Dashboard to:
- View all restaurants on an interactive Google Map
- Filter by cuisine type, rating, price range
- Adjust search radius (1-50 km)
- Switch between map and list views
- Click markers for restaurant details
- Get directions to any restaurant

### Reviews
Comprehensive review system with:
- Write detailed reviews with multiple rating categories
- Upload photos of your dining experience
- Rate service quality separately
- Filter and search all reviews
- View rating distribution charts
- Sort by newest, highest rated, most helpful

### Restaurants
Browse all restaurants with:
- Detailed information cards
- Cuisine categories
- Price indicators
- Average ratings
- Location information

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Bootstrap 5** - Responsive framework
- **React Icons** - Icon library
- **@react-google-maps/api** - Google Maps integration
- **CSS3** - Advanced styling with glassmorphism

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 📂 Project Structure

```
foxy-confidential/
├── public/                 # Static files
├── src/
│   ├── components/
│   │   ├── Dashboard/     # Map dashboard component
│   │   ├── Reviews/       # Review system
│   │   ├── Home/          # Landing page
│   │   ├── Nav/           # Navigation
│   │   └── ...
│   ├── assets/            # Images and media
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── server/                # Backend API
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & validation
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
└── package.json          # Dependencies
```

## 🎨 Design System

### Color Palette
- **Primary**: `#ff6b6b` (Coral Red)
- **Secondary**: `#ee5a6f` (Rose)
- **Accent**: `#00d2d3` (Cyan)
- **Success**: `#00d084` (Green)
- **Warning**: `#ffc107` (Amber)
- **Dark**: `rgba(0, 0, 0, 0.4)` (Semi-transparent)

### Typography
- **Headings**: Bold, 700-800 weight
- **Body**: 400-500 weight
- **Accents**: 600 weight with letter spacing

## 🔧 Configuration

### Environment Variables (.env)
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Server Environment (server/.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=foxy_confidential
JWT_SECRET=your_jwt_secret
```

## 📦 Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

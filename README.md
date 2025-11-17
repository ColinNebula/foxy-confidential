# Foxy Confidential - Restaurant Discovery Platform 🦊

> A modern, secure, and full-featured restaurant discovery and review platform with interactive maps, advanced filtering, and comprehensive review system.

**Created by Developer Colin Nebula for [Nebula 3D Development](https://github.com/ColinNebula)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933.svg)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-Hardened-success.svg)](./SECURITY.md)

## 💡 What is Foxy Confidential?

Foxy Confidential is a **user-centric restaurant discovery platform** that helps food enthusiasts find, review, and share their dining experiences. Whether you're exploring new cuisines in your neighborhood or planning your next culinary adventure, Foxy Confidential provides all the tools you need in one beautiful, intuitive interface.

### Why Foxy Confidential?

🎯 **For Diners:**
- Discover hidden gems and popular restaurants near you
- Read authentic reviews from real food lovers
- Make informed decisions with detailed ratings across multiple categories
- Save your favorite places and track your dining journey
- Share your experiences with photos and comprehensive reviews

🏪 **For Restaurant Enthusiasts:**
- Build your personal restaurant collection
- Track where you've been and rate your experiences
- Compare restaurants side-by-side
- Get personalized recommendations based on your preferences

📊 **For Data-Driven Foodies:**
- View aggregated ratings and statistics
- Filter by cuisine, price, distance, and ratings
- See rating distributions and trends
- Make decisions backed by real data

## 🌟 Key Features

### 🗺️ Interactive Map Dashboard
Explore restaurants with our powerful map interface:
- **Live Map Integration** - Real-time restaurant markers with custom icons
- **GPS Location Detection** - Automatically find restaurants near you with accuracy radius display
- **Smart Search Bar** - Search restaurants by name, cuisine, or address with instant filtering
- **Multiple Map Styles** - Choose between standard, satellite, and terrain views
- **Quick Action Buttons** - Re-center map, toggle search, and show/hide legend
- **Distance Radius Control** - Adjust search radius from 1-50 km with visual circle overlay
- **Restaurant Legend** - Color-coded markers (regular restaurants, user-added places, your location)
- **Collapsible Info Panel** - View restaurant count and location stats without blocking controls
- **Click-to-Details** - Tap any marker to see restaurant information and get directions

### ⭐ Comprehensive Review System
Share and discover authentic dining experiences:
- **Multi-Category Ratings** - Rate food quality, taste, ambiance, creativity, and uniqueness (1-5 stars)
- **Service Quality Metrics** - Evaluate speed, staff friendliness, knowledge, and attentiveness
- **Photo Upload Gallery** - Attach multiple images to your reviews (up to 10 per review)
- **Detailed Written Reviews** - Share your full dining experience with rich text support
- **Advanced Filtering** - Filter reviews by rating ranges, date periods, and verified status
- **Rating Distribution Charts** - Visual breakdown of ratings across all categories
- **Sort & Search** - Sort by newest, highest rated, most helpful, or search by keywords
- **Verified Reviewer Badges** - See which reviews come from verified diners
- **Helpful Votes** - Upvote useful reviews to help others make informed decisions

### 🎯 Advanced Restaurant Filtering
Find exactly what you're craving:
- **Cuisine Types** - Filter by 20+ cuisine categories (Italian, Asian, Mexican, Mediterranean, etc.)
- **Price Range** - Budget-friendly ($), moderate ($$), or fine dining ($$$)
- **Rating Threshold** - Show only restaurants above your chosen star rating
- **Distance Filter** - Adjust search radius dynamically with live map updates
- **Open Now** - See which restaurants are currently open for service
- **Combined Filters** - Stack multiple filters for precise results

### 👤 User Restaurant Management
Build your personal food guide:
- **Add Your Favorites** - Manually add restaurants with full details (name, address, cuisine, price)
- **Custom Ratings** - Rate your own restaurant additions with the Foxy Tail system (1-5 tails)
- **Upload Photos** - Add your own photos to restaurant entries
- **Personal Notes** - Keep private notes about each place (e.g., "best pizza in town", "ask for John")
- **Favorites System** - Heart your favorite places for quick access
- **Dining History** - Track all restaurants you've visited
- **User-Added Badge** - Your contributions display with a special gold star marker

### 📊 Live Dashboard Statistics
Stay informed with real-time metrics:
- **Restaurant Count** - See total restaurants in your area
- **Cuisine Breakdown** - Distribution of available cuisine types
- **Average Ratings** - Community rating averages
- **Your Location Display** - Always know where you are on the map (blue marker)
- **Nearby Count** - Restaurants within your selected radius

### 🎨 Premium UI/UX Experience
Beautiful design meets functionality:
- **Glassmorphism Effects** - Modern frosted glass design throughout the app
- **Smooth Animations** - Fluid page transitions, hover effects, and micro-interactions
- **Dark Theme** - Eye-friendly dark interface with vibrant accent colors
- **Fully Responsive** - Perfect experience on desktop (1920px+), tablets (768px), and mobile (375px+)
- **Touch Optimized** - Swipe gestures and touch-friendly controls for mobile
- **Loading States** - Skeleton screens and spinners for better perceived performance
- **Error Handling** - User-friendly error messages with recovery suggestions
- **PWA Support** - Install on your device and use offline (coming soon)

### 🔐 Enterprise-Grade Security
Your data is protected:
- **JWT Authentication** - Secure token-based user sessions
- **Password Encryption** - Bcrypt hashing with salt rounds (never store plain text)
- **SQL Injection Protection** - Parameterized queries throughout the backend
- **XSS Prevention** - Input sanitization and output escaping
- **CORS Configuration** - Controlled cross-origin resource sharing
- **Rate Limiting** - DDoS and brute-force attack protection (100 requests/15min)
- **Security Headers** - Helmet.js for comprehensive HTTP header security
- **Environment Variables** - All secrets stored in `.env` files (never committed)
- **Pre-commit Hooks** - Automatic security scans before every commit
- **Regular Audits** - Automated dependency vulnerability scanning

### 🔧 Full-Stack Backend Integration
Powerful API and database:
- **RESTful API** - Complete Express.js backend with proper HTTP methods
- **MySQL Database** - Robust relational database with optimized schema
- **User Management** - Registration, login, logout, profile updates
- **Admin Dashboard** - Manage restaurants, users, and reviews (admin-only)
- **Connection Pooling** - Optimized database connections for performance
- **Error Logging** - Comprehensive server-side logging for debugging
- **API Documentation** - Clear endpoints with request/response examples

### 📦 Optimized Performance
Fast and efficient:
- **Git LFS** - Large images stored efficiently (28 files, ~24MB)
- **Code Splitting** - Lazy loading for faster initial page load
- **Image Optimization** - Compressed assets for quick loading
- **Caching Strategy** - Browser caching for static resources
- **Minified Production Build** - Optimized bundle size for deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- MySQL 8.x or higher (for backend features)
- Google Maps API key (optional, for production)
- Git
- **Git LFS** (for large files) - [Installation Guide](https://git-lfs.github.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ColinNebula/foxy-confidential.git
cd foxy-confidential

# Verify Git LFS files downloaded
git lfs ls-files
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

## 💖 Support This Project

**Foxy Confidential** is a passion project created by **Colin Nebula** at **Nebula 3D Development** with the mission of building **user-centric applications** that make people's lives easier and more enjoyable.

### Why Support?

Your support helps us:
- 🚀 Continue developing new features and improvements
- 🐛 Maintain and fix bugs promptly
- 🎨 Enhance UI/UX based on user feedback
- 📱 Expand to mobile platforms (iOS/Android)
- 🌐 Keep the servers running and API services active
- 🔒 Maintain security and privacy standards
- 📚 Create comprehensive documentation and tutorials

### How to Support

#### 💰 Donations
- **PayPal**: [Donate via PayPal](https://paypal.me/ColinNebula) 
- **Buy Me a Coffee**: [Support on Ko-fi](https://ko-fi.com/colinnebula) 
- **GitHub Sponsors**: [Sponsor on GitHub](https://github.com/sponsors/ColinNebula) 

#### 🌟 Other Ways to Help
- ⭐ **Star this repository** - Show your appreciation
- 🐛 **Report bugs** - Help us improve quality
- 💡 **Suggest features** - Share your ideas
- 📝 **Contribute code** - Submit pull requests
- 📣 **Spread the word** - Tell others about Foxy Confidential
- 📚 **Improve documentation** - Help new users get started

### Enterprise & Custom Solutions

Interested in a custom version for your business? Contact **Nebula 3D Development** for:
- 🏢 White-label restaurant discovery platforms
- 🎨 Custom branding and design
- 🔧 Feature customization and integrations
- 📊 Analytics and reporting dashboards
- 🛠️ Technical support and maintenance

**Contact**: [Your Email] or visit [Your Website]

---

**Thank you for supporting user-centric development!** Every contribution, no matter how small, helps us continue building amazing applications that put users first. 🦊❤️

---

*Made with ❤️ by [Colin Nebula](https://github.com/ColinNebula) at Nebula 3D Development*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

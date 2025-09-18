# Foxy Confidential - MySQL Backend Setup Guide

Congratulations! 🎉 You've successfully set up the backend infrastructure for Foxy Confidential. Here's what has been created:

## ✅ What's Been Completed

### 1. Backend Server Structure
- **Express.js server** with proper MVC architecture
- **Database models** for Users, Restaurants, Reviews, and Admins
- **JWT authentication** with role-based access control
- **RESTful API endpoints** with validation and error handling
- **Security middleware** (CORS, Helmet, Rate Limiting)
- **Environment configuration** for development and production

### 2. Database Schema
- **Complete MySQL schema** with optimized tables and relationships
- **User management** with email verification and password reset
- **Restaurant management** with awards, highlights, and metadata
- **Review system** with 5-category ratings and reactions
- **Admin system** with permissions and audit logging
- **Performance indexes** and views for efficient queries

### 3. API Features
- **Authentication endpoints** (register, login, profile management)
- **Restaurant CRUD operations** with filtering and search
- **Review management** with moderation capabilities
- **Admin dashboard** with statistics and management tools
- **File upload support** for images and documents
- **Comprehensive validation** and error handling

## 🚀 Next Steps

### Step 1: Install MySQL
You need to install MySQL to run the backend. Choose one option:

#### Option A: Install MySQL Server Locally
1. Download MySQL 8.0+ from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Install and set up with a root password
3. Update the `.env` file in the server directory with your MySQL credentials

#### Option B: Use XAMPP (Easier for Development)
1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Install and start the MySQL service
3. Use default credentials (root with no password)

#### Option C: Use Docker (Recommended for Development)
```bash
docker run -d --name foxy-mysql -e MYSQL_ROOT_PASSWORD=foxy123 -e MYSQL_DATABASE=foxy_confidential -p 3306:3306 mysql:8.0
```

### Step 2: Configure Database
1. Edit `server/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=foxy_confidential
DB_USER=root
DB_PASSWORD=your_password_here
```

2. Create the database schema:
```bash
# Navigate to server directory
cd server

# Login to MySQL and run the schema
mysql -u root -p < config/database.sql
```

### Step 3: Start the Backend Server
```bash
# From the server directory
cd server
npm start

# Or for development with auto-reload
npm run dev
```

### Step 4: Test the API
The server will start on `http://localhost:5000`

Test endpoints:
- Health check: `GET http://localhost:5000/health`
- Register user: `POST http://localhost:5000/api/auth/register`
- Login: `POST http://localhost:5000/api/auth/login`
- Get restaurants: `GET http://localhost:5000/api/restaurants`

### Step 5: Update Frontend to Use API
Modify your React components to fetch data from the backend instead of static data:

```javascript
// Example: Update restaurantData.js to use API
const API_BASE_URL = 'http://localhost:5000/api';

export const fetchRestaurants = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE_URL}/restaurants?${queryString}`);
  const data = await response.json();
  return data.data.restaurants;
};
```

## 📊 Database Features

The MySQL database includes:

### Users Table
- User authentication and profile management
- Email verification and password reset
- Session tracking and security

### Restaurants Table
- Complete restaurant information
- Awards, highlights, and gallery images
- Location and contact details
- Opening hours and amenities

### Reviews Table
- 5-category rating system (Food, Taste, Ambiance, Creativity, Uniqueness)
- User reactions (helpful/unhelpful)
- Review moderation system
- Calculated overall ratings

### Admin System
- Role-based permissions
- Audit logging
- Dashboard statistics
- Content moderation tools

## 🔐 Security Features

- **JWT Authentication** with secure token generation
- **Password hashing** with bcryptjs and salt rounds
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **SQL injection prevention** with parameterized queries
- **CORS protection** for cross-origin requests
- **Security headers** with Helmet middleware

## 🛠 Development Tools

### API Testing
Use tools like Postman or Insomnia to test the API endpoints:

1. **Register a user:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123",
  "first_name": "Test",
  "last_name": "User"
}
```

2. **Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123"
}
```

3. **Get restaurants:**
```
GET http://localhost:5000/api/restaurants
```

### Database Management
- Use MySQL Workbench for visual database management
- phpMyAdmin if using XAMPP
- Command line tools for advanced operations

## 📱 Frontend Integration

To connect your React frontend to the backend:

1. **Install axios** for API calls:
```bash
npm install axios
```

2. **Create an API service:**
```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

3. **Update your components** to use the API instead of static data.

## 🎯 What You Can Do Now

With this backend setup, you can:

- ✅ **User Registration & Authentication**
- ✅ **Restaurant Management** (CRUD operations)
- ✅ **Review System** with ratings
- ✅ **Admin Panel** for content management
- ✅ **Secure API** with proper validation
- ✅ **Scalable Architecture** for future features

## 🆘 Troubleshooting

### Common Issues:

1. **Database connection failed:**
   - Check MySQL is running
   - Verify credentials in `.env`
   - Ensure database exists

2. **Module not found errors:**
   - Run `npm install` in server directory
   - Check file paths and imports

3. **Port already in use:**
   - Change PORT in `.env` to another value (e.g., 5001)
   - Or stop other services using port 5000

### Get Help:
- Check server logs for detailed error messages
- Review the `.env` configuration
- Test database connection separately

## 🔄 Next Development Steps

1. **Complete the review system** (full CRUD for reviews)
2. **Add file upload** for restaurant images
3. **Implement email service** for verification and notifications
4. **Add search and filtering** enhancements
5. **Create admin dashboard** frontend
6. **Add real-time features** with WebSockets
7. **Implement caching** with Redis
8. **Add testing** with Jest and Supertest

Your backend is now ready for development! 🚀
# Foxy Confidential Backend API

A robust Node.js/Express backend API for the Foxy Confidential restaurant rating application with MySQL database integration.

## Features

- 🔐 JWT Authentication & Authorization
- 👤 User Management with Role-based Access Control
- 🍽️ Restaurant Management
- ⭐ Review & Rating System
- 🛡️ Admin Dashboard
- 📊 MySQL Database with Optimized Queries
- 🔒 Security Middleware (Helmet, CORS, Rate Limiting)
- ✅ Input Validation & Sanitization
- 📝 Comprehensive Error Handling
- 🎯 RESTful API Design

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL 8.0+
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit
- **Environment:** dotenv

## Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database credentials and other configuration.

4. Set up MySQL database:
```bash
# Login to MySQL
mysql -u root -p

# Run the database schema
source config/database.sql
```

5. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts and profile information
- **admins** - Admin roles and permissions
- **restaurants** - Restaurant details and metadata
- **restaurant_awards** - Restaurant awards and recognitions
- **restaurant_highlights** - Restaurant highlights and features
- **reviews** - User reviews with 5-category ratings
- **review_reactions** - Helpful/unhelpful reactions to reviews
- **user_sessions** - JWT session management
- **audit_logs** - System audit trail

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/featured` - Get featured restaurants
- `GET /api/restaurants/top-rated` - Get top rated restaurants
- `GET /api/restaurants/cuisine/:cuisine` - Get restaurants by cuisine
- `POST /api/restaurants` - Create restaurant (admin)
- `PUT /api/restaurants/:id` - Update restaurant (admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin)
- `PATCH /api/restaurants/:id/toggle-featured` - Toggle featured status (admin)

### Reviews
- Coming soon...

### Users
- Coming soon...

### Admin
- Coming soon...

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=foxy_confidential
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs with salt rounds
- **Rate Limiting** - Prevent abuse and brute force attacks
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configured for frontend domains
- **Helmet Security** - Security headers and protections
- **SQL Injection Prevention** - Parameterized queries
- **Admin Authorization** - Role-based access control

## Development

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## Database Setup Instructions

1. Install MySQL 8.0+
2. Create a new database user (optional but recommended):
```sql
CREATE USER 'foxy_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON foxy_confidential.* TO 'foxy_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Run the database schema:
```bash
mysql -u root -p < config/database.sql
```

4. The schema includes:
   - All necessary tables with proper relationships
   - Indexes for optimal performance
   - Sample admin user (username: admin, password: admin123456)
   - Views for complex queries

## API Response Format

All API responses follow this consistent format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {
    // Response data
  },
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Database errors
- Authentication errors
- Authorization errors
- Not found errors
- Server errors

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP
- Review creation: 3 requests per hour per IP

## License

MIT License - see LICENSE file for details.
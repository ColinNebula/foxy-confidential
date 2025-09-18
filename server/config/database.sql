-- Foxy Confidential Database Schema
-- Drop database if exists (for development purposes)
DROP DATABASE IF EXISTS foxy_confidential;

-- Create database
CREATE DATABASE foxy_confidential CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE foxy_confidential;

-- Create Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Admins table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Restaurants table
CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'USA',
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    price_range ENUM('$', '$$', '$$$', '$$$$') DEFAULT '$$',
    open_since YEAR,
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255),
    gallery_images JSON,
    opening_hours JSON,
    amenities JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_cuisine (cuisine),
    INDEX idx_city (city),
    INDEX idx_price_range (price_range),
    INDEX idx_featured (featured),
    INDEX idx_active (is_active)
);

-- Create Restaurant Awards table
CREATE TABLE restaurant_awards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    award_name VARCHAR(100) NOT NULL,
    award_year YEAR,
    award_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Create Restaurant Highlights table
CREATE TABLE restaurant_highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    highlight VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Create Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200),
    content TEXT NOT NULL,
    food_rating DECIMAL(2,1) CHECK (food_rating >= 0 AND food_rating <= 5),
    taste_rating DECIMAL(2,1) CHECK (taste_rating >= 0 AND taste_rating <= 5),
    ambiance_rating DECIMAL(2,1) CHECK (ambiance_rating >= 0 AND ambiance_rating <= 5),
    creativity_rating DECIMAL(2,1) CHECK (creativity_rating >= 0 AND creativity_rating <= 5),
    uniqueness_rating DECIMAL(2,1) CHECK (uniqueness_rating >= 0 AND uniqueness_rating <= 5),
    overall_rating DECIMAL(2,1) GENERATED ALWAYS AS (
        (food_rating + taste_rating + ambiance_rating + creativity_rating + uniqueness_rating) / 5
    ) STORED,
    visit_date DATE,
    images JSON,
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'approved', 'rejected', 'hidden') DEFAULT 'pending',
    moderated_by INT,
    moderated_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moderated_by) REFERENCES admins(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_restaurant (user_id, restaurant_id),
    INDEX idx_restaurant (restaurant_id),
    INDEX idx_user (user_id),
    INDEX idx_overall_rating (overall_rating),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Create Review Reactions table
CREATE TABLE review_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type ENUM('helpful', 'unhelpful') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_review_reaction (user_id, review_id)
);

-- Create User Sessions table
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
);

-- Create Audit Log table
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Create Views for better data access
CREATE VIEW restaurant_ratings AS
SELECT 
    r.id,
    r.name,
    r.cuisine,
    r.city,
    r.price_range,
    COUNT(rv.id) as review_count,
    COALESCE(AVG(rv.overall_rating), 0) as avg_overall_rating,
    COALESCE(AVG(rv.food_rating), 0) as avg_food_rating,
    COALESCE(AVG(rv.taste_rating), 0) as avg_taste_rating,
    COALESCE(AVG(rv.ambiance_rating), 0) as avg_ambiance_rating,
    COALESCE(AVG(rv.creativity_rating), 0) as avg_creativity_rating,
    COALESCE(AVG(rv.uniqueness_rating), 0) as avg_uniqueness_rating,
    r.featured,
    r.is_active,
    r.created_at
FROM restaurants r
LEFT JOIN reviews rv ON r.id = rv.restaurant_id AND rv.status = 'approved'
WHERE r.is_active = TRUE
GROUP BY r.id, r.name, r.cuisine, r.city, r.price_range, r.featured, r.is_active, r.created_at;

-- Create indexes for better performance
CREATE INDEX idx_reviews_ratings ON reviews(restaurant_id, status, overall_rating);
CREATE INDEX idx_users_email_verified ON users(email, email_verified, is_active);
CREATE INDEX idx_restaurants_search ON restaurants(name, cuisine, city);

-- Insert sample admin user (password: admin123456)
INSERT INTO users (username, email, password_hash, first_name, last_name, is_active, email_verified) 
VALUES ('admin', 'admin@foxyconfidential.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewwrF7f8KCcUxKo2', 'Admin', 'User', TRUE, TRUE);

INSERT INTO admins (user_id, role, permissions) 
VALUES (1, 'super_admin', '{"restaurants": ["create", "read", "update", "delete"], "users": ["create", "read", "update", "delete"], "reviews": ["create", "read", "update", "delete", "moderate"]}');
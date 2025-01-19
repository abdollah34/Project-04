CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (Password: Hrry7357)
INSERT INTO admin_users (email, password) VALUES 
('admin@pixelfga.com', '$2y$10$WU2Bfj0WcFwrqhKI9nzGpO4H6YrAnwp6h3wu52/CkWgBGFzbzQKGy')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

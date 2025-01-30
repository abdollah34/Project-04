CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(50),
    stock INT DEFAULT 0,
    rating DECIMAL(3,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear all existing products
TRUNCATE TABLE products;

-- Reset the auto-increment
ALTER TABLE products AUTO_INCREMENT = 1;

-- Insert sample products
INSERT INTO products (name, description, price, image, category, stock, rating) VALUES
('iPhone 13 Pro', 'Latest Apple iPhone with A15 Bionic chip', 11999.99, 'uploads/products/iphone13pro.jpg', 'smartphones', 50, 4.8),
('Samsung Galaxy S21', '5G Flagship phone with 108MP camera', 8999.99, 'uploads/products/galaxys21.jpg', 'smartphones', 45, 4.7),
('MacBook Pro 14"', 'M1 Pro chip, 16GB RAM, 512GB SSD', 21999.99, 'uploads/products/macbookpro.jpg', 'laptops', 30, 4.9),
('Dell XPS 15', 'Intel i7, 32GB RAM, 1TB SSD', 19999.99, 'uploads/products/dellxps.jpg', 'laptops', 25, 4.6),
('AirPods Pro', 'Active noise cancellation earbuds', 2499.99, 'uploads/products/airpodspro.jpg', 'accessories', 100, 4.7),
('Samsung Galaxy Watch 4', 'Smart watch with health tracking', 2999.99, 'uploads/products/galaxywatch4.jpg', 'accessories', 60, 4.5),
('iPad Air', '10.9-inch Liquid Retina display', 7499.99, 'uploads/products/ipadair.jpg', 'tablets', 40, 4.8),
('Sony WH-1000XM4', 'Wireless noise cancelling headphones', 3499.99, 'uploads/products/sony1000xm4.jpg', 'accessories', 55, 4.9);
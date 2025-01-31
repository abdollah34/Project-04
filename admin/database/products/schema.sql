-- Drop tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;

-- Create products table
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `specs` JSON DEFAULT NULL,
  `sales` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_brand` (`brand`),
  INDEX `idx_price` (`price`),
  INDEX `idx_sales` (`sales`),
  FULLTEXT INDEX `idx_search` (`name`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create product_images table
CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_product_images` (`product_id`, `is_primary`),
  CONSTRAINT `fk_product_images_product` 
    FOREIGN KEY (`product_id`) 
    REFERENCES `products` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `uc_primary_image` 
    UNIQUE KEY (`product_id`, `is_primary`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample categories (optional)
INSERT INTO `products` (`name`, `category`, `brand`, `price`, `stock`, `description`, `specs`) VALUES
('MacBook Pro 16"', 'laptops', 'Apple', 2399.99, 10, 'Latest MacBook Pro with M1 Pro chip', 
  JSON_OBJECT(
    'processor', 'Apple M1 Pro',
    'ram', '16GB',
    'storage', '512GB SSD',
    'display', '16-inch Liquid Retina XDR',
    'graphics', 'Integrated 16-core GPU'
  )
),
('Custom Gaming PC', 'desktops', 'Custom', 1999.99, 5, 'High-end gaming desktop', 
  JSON_OBJECT(
    'processor', 'Intel Core i9-12900K',
    'ram', '32GB DDR5',
    'storage', '2TB NVMe SSD',
    'graphics', 'NVIDIA RTX 3080 Ti',
    'motherboard', 'ASUS ROG Z690'
  )
);

-- Add some sample images (optional)
INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `sort_order`) VALUES
(1, '/admin/uploads/products/macbook-pro-1.jpg', 1, 0),
(1, '/admin/uploads/products/macbook-pro-2.jpg', 0, 1),
(2, '/admin/uploads/products/gaming-pc-1.jpg', 1, 0),
(2, '/admin/uploads/products/gaming-pc-2.jpg', 0, 1);

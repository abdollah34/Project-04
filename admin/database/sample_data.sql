-- Insert a sample product
INSERT INTO products (
    name,
    category,
    brand,
    price,
    stock,
    description,
    specs
) VALUES (
    'ASUS ROG Strix G15',
    'laptops',
    'ASUS',
    15999.99,
    15,
    'Professional gaming laptop with high-performance specs and RGB lighting',
    '{
        "processor": "Intel Core i7-12700H",
        "graphics": "NVIDIA RTX 3060 6GB",
        "ram": "16GB DDR4",
        "storage": "1TB NVMe SSD",
        "display": "15.6-inch FHD 144Hz",
        "os": "Windows 11",
        "battery": "90WHr",
        "weight": "2.3 kg"
    }'
);

-- Insert sample images for the product
INSERT INTO product_images (
    product_id,
    image_url,
    is_primary
) VALUES 
(LAST_INSERT_ID(), '/admin/uploads/products/rog_strix_g15_main.jpg', 1),
(LAST_INSERT_ID(), '/admin/uploads/products/rog_strix_g15_side.jpg', 0),
(LAST_INSERT_ID(), '/admin/uploads/products/rog_strix_g15_back.jpg', 0);

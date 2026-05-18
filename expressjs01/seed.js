require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const dbURI = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/fullstack02';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB for seeding...'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const seedData = async () => {
    try {
        await Category.deleteMany({});
        await Product.deleteMany({});

        const categories = await Category.insertMany([
            { name: 'PlayStation', slug: 'playstation', description: 'Tay cầm cho hệ máy PlayStation' },
            { name: 'Xbox', slug: 'xbox', description: 'Tay cầm cho hệ máy Xbox và PC' },
            { name: 'Nintendo', slug: 'nintendo', description: 'Tay cầm cho Nintendo Switch' },
            { name: 'PC & Mobile', slug: 'pc-mobile', description: 'Tay cầm chơi game đa nền tảng' }
        ]);

        const products = [
            {
                name: 'Sony DualSense Wireless Controller',
                slug: 'sony-dualsense-wireless-controller',
                description: 'Tay cầm thế hệ mới cho PS5 với haptic feedback và adaptive triggers.',
                price: 1690000,
                originalPrice: 1990000,
                images: [
                    'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?q=80&w=800',
                    'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?q=80&w=800'
                ],
                stock: 50,
                sold: 120,
                views: 350,
                category: categories[0]._id,
                isNewProduct: true,
                isFeatured: true
            },
            {
                name: 'Xbox Wireless Controller - Carbon Black',
                slug: 'xbox-wireless-controller-carbon-black',
                description: 'Thiết kế hiện đại, thoải mái chơi trên Xbox Console, PC, và Mobile.',
                price: 1450000,
                originalPrice: 1450000,
                images: [
                    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=800',
                    'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800'
                ],
                stock: 100,
                sold: 250,
                views: 620,
                category: categories[1]._id,
                isNewProduct: false,
                isFeatured: true
            },
            {
                name: 'Nintendo Switch',
                slug: 'nintendo-switch',
                description: 'Switch.',
                price: 1850000,
                originalPrice: 2000000,
                images: [
                    'https://images.unsplash.com/photo-1612036781124-847f8939b154?q=80&w=800',
                    'https://images.unsplash.com/photo-1615680022647-99c397cbcaea?q=80&w=800'
                ],
                stock: 20,
                sold: 45,
                views: 180,
                category: categories[2]._id,
                isNewProduct: false,
                isFeatured: false
            },
            {
                name: 'Sony DualSense Edge',
                slug: 'sony-dualsense-edge',
                description: 'Tay cầm Pro cho PS5, tùy chỉnh không giới hạn.',
                price: 5490000,
                originalPrice: 5990000,
                images: [
                    'https://images.unsplash.com/photo-1677721605698-d8540b35411b?q=80&w=800',
                    'https://images.unsplash.com/photo-1659167911918-03fe74c396f8?q=80&w=800'
                ],
                stock: 10,
                sold: 5,
                views: 90,
                category: categories[0]._id,
                isNewProduct: true,
                isFeatured: false
            },
            {
                name: 'Xbox Elite Wireless Controller Series 2',
                slug: 'xbox-elite-wireless-controller-series-2',
                description: 'Trải nghiệm đỉnh cao dành cho game thủ chuyên nghiệp.',
                price: 4590000,
                originalPrice: 4990000,
                images: [
                    'https://images.unsplash.com/photo-1636908067903-abaedc57ab2b?q=80&w=800',
                    'https://images.unsplash.com/photo-1632160912326-d2a71f4af742?q=80&w=800'
                ],
                stock: 15,
                sold: 30,
                views: 240,
                category: categories[1]._id,
                isNewProduct: true,
                isFeatured: true
            },
        ];

        await Product.insertMany(products);
        console.log('Seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

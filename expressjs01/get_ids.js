require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        const category = await Category.findOne();
        const product = await Product.findOne();
        console.log(JSON.stringify({
            categoryId: category ? category._id : null,
            productId: product ? product._id : null
        }));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
connection();

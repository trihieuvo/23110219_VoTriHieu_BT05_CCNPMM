const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
        let query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else sortOption.createdAt = -1; // default new

        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        return res.status(200).json({
            products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getHomeProducts = async (req, res) => {
    try {
        const newProducts = await Product.find({ isNewProduct: true }).limit(8).populate('category', 'name');
        const featuredProducts = await Product.find({ isFeatured: true }).sort({ sold: -1 }).limit(8).populate('category', 'name');
        const saleProducts = await Product.find({ $expr: { $gt: ["$originalPrice", "$price"] } }).limit(8).populate('category', 'name');

        return res.status(200).json({
            newProducts,
            featuredProducts,
            saleProducts
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category', 'name slug');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const currentProduct = await Product.findById(id);
        if (!currentProduct) return res.status(404).json({ message: 'Product not found' });

        const relatedProducts = await Product.find({
            category: currentProduct.category,
            _id: { $ne: id }
        }).limit(4).populate('category', 'name');

        return res.status(200).json(relatedProducts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getHomeProducts,
    getProductDetail,
    getRelatedProducts
};

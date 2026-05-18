const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getCategories } = require('../controllers/categoryController');
const { getProducts, getHomeProducts, getProductDetail, getRelatedProducts } = require('../controllers/productController');
const auth = require('../middleware/auth');

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
})

// Auth
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, getAccount);

// Category
routerAPI.get("/categories", getCategories);

// Product
routerAPI.get("/products", getProducts);
routerAPI.get("/products/home", getHomeProducts);
routerAPI.get("/products/:id", getProductDetail);
routerAPI.get("/products/:id/related", getRelatedProducts);

module.exports = routerAPI;
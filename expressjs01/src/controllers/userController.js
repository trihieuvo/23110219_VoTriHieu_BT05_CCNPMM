const { createUserService, loginService } = require('../services/userService');
const User = require('../models/user');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data);
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
}

const getUser = async (req, res) => {
    try {
        const data = await User.find({}).select("-password");
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ EM: "Lỗi server", EC: -1 });
    }
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

module.exports = { createUser, handleLogin, getUser, getAccount };
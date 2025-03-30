const express = require('express');
const {
	Login,
	Register,
	Logout,
	updateProfile,
	checkAuth,
} = require('../controllers/auth.controller');
const { protectRoute } = require('../middleware/auth.middleware');
const authRouter = express.Router();

authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);
authRouter.put('/updateProfile', protectRoute, updateProfile);
authRouter.get('/check', protectRoute, checkAuth);
// authRouter.get('/', (req, res) => {
// 	res.send('this auth page');
// });
module.exports = { authRouter };

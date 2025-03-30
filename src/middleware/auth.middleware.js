const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({
				msg: 'unauthorized - no token found',
			});
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		if (!decoded) {
			return res.status(401).json({ msg: 'unauthorized -invalid token' });
		}
		const user = await User.findById(decoded.userId).select('-password');
		if (!user) {
			return res.status(404).json({ msg: 'user not found ' });
		}
		req.user = user;
		next();
	} catch (error) {
		console.log('Error in login controller ', error.message);
		res.status(500).json({ msg: 'Internal server error' });
	}
};
module.exports = { protectRoute };

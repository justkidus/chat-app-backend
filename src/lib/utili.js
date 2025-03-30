const jwt = require('jsonwebtoken');
const generateToken = async (userId, res) => {
	const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
		expiresIn: '30d',
	});
	res.cookie('jwt', token, {
		maxAge: 30 * 24 * 60 * 60 * 100, //MS
		httpOnly: true, //prevent XSS attaks cross-site scirpting attacks
		sameSite: 'strict', //CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== 'development',
	});
	return token;
};
module.exports = { generateToken };

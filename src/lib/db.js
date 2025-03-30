const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB);
		console.log('MONGODB CONNECTED SUCCESSFULY');
	} catch (error) {
		throw error;
	}
};
module.exports = { connectDB };

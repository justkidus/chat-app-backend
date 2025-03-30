const { User } = require('../models/user.model');
const { Message } = require('../models/message.model');
const { cloudinary } = require('../lib/cloudinary');

const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({
			_id: { $ne: loggedInUserId }, //tells the mongoose to fetch all the users other than the user
		}).select('-password'); // this tells mongoose to fetch user without the user password
		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error('Error in getUsersForSidebar', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};
const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const myId = req.user._id;
		const messages = await Message.find({
			$or: [
				{ senderId: myId, receiverId: userToChatId },
				{ senderId: userToChatId, receiverId: myId },
			],
		});
		res.status(200).json(messages);
	} catch (error) {
		console.log('Error in getMessage controller :', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};
const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			//upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}
		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});
		await newMessage.save();
		//todo :realtime functionallity goes here => socket.io
		res.status(201).json({ newMessage });
	} catch (error) {
		console.log('Error in send message controller ', error.message);
		res.status(500).json({ error: 'internal server error' });
	}
};
module.exports = { getUsersForSidebar, getMessages, sendMessage };

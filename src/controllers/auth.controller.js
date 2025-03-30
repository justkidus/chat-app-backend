const express = require('express');
const { User } = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../lib/utili');
const cloudinary = require('../lib/cloudinary');
const Register = async (req, res) => {
	const { fullName, email, password } = req.body;
	if (!fullName || !email || !password) {
		return res.status(400).json('All fields are required');
	}
	try {
		if (password.length < 6)
			return res.status(400).json({
				msg: 'Password must be at least 6 charaters',
			});

		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: 'Email already exists' });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			email,
			password: hashedPassword,
		});
		if (newUser) {
			//generate token
			generateToken(newUser._id, res);
			await newUser.save();
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ message: 'Invalid user Info' });
		}
	} catch (error) {
		console.log('error in signup controller', error.message);
		res.status(500).json({ msg: 'Internal server error' });
	}
};
const Login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ msg: 'Invalid credentials' });
		}
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ msg: 'Invalid credentials' });
		}
		generateToken(user._id, res);
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log('Error in login controller ', error.message);
		res.status(500).json({ msg: 'Internal server error' });
	}
};

const Logout = async (req, res) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 });
		res.status(200).json({ msg: 'Logged out successfully' });
	} catch (error) {
		console.log('Error in login controller ', error.message);
		res.status(500).json({ msg: 'Internal server error' });
	}
};

const updateProfile = async (req, res) => {
	try {
		const { profilePic } = req.body;
		const userId = req.user._id;

		if (!profilePic) {
			return res.status(400).json({
				msg: 'profile pic is required',
			});
		}
		const uploadResponse = await cloudinary.uploader.upload(profilePic);
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ profilePic: uploadResponse.secure_url },
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (error) {
		console.log('error in update profile ', error);
		res.status(500).json({ msg: 'Internal server error' });
	}
};

const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		console.log('Error in Check Auth controller', error.msg);
		res.status(500).json({ msg: 'internal server error' });
	}
};
module.exports = { Login, Register, Logout, updateProfile, checkAuth };

// Jl4mbXyYl862YVX6;

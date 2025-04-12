const express = require('express');
const { authRouter } = require('./routes/auth.route');
const dotenv = require('dotenv');
const { connectDB } = require('./lib/db');
const cookieParser = require('cookie-parser');
const { messageRouter } = require('./routes/message.route');
const cors = require('cors');
const { app, server } = require('./lib/socket');

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

const port = process.env.PORT;
server.listen(port, () => {
	console.log(`server is running at http://localhost:${port}`);
	connectDB();
});

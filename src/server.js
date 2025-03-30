const express = require('express');
const { authRouter } = require('./routes/auth.route');
const dotenv = require('dotenv');
const { connectDB } = require('./lib/db');
const cookieParser = require('cookie-parser');
const { messageRouter } = require('./routes/message.route');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`server is running at http://localhost:${port}`);
	connectDB();
});

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { models } = require('../models')
const client = require('../middlewares/connectRedis')
const passport = require('../middlewares/passport-setup')
const { produceMessage } = require('../middlewares/kafkaClient'); 
const nodemailer = require('nodemailer'); 
const path = require('path');
const fs = require('fs')
const { Op } = require('sequelize')
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../middlewares/jwtService')
// TODO: move to environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'canhmail292@gmail.com',
        pass: 'hajcwelbzkljvsgp'
    }
})
const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body.data;
        console.log(req.body.data, "req.body.data");
        const user = await models.User.findOne({
            where: { 
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        });
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: 'Username is not registered.'
            });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: 'Password is incorrect.'
            });
        }
        // Check if the email is verified
        if (!user.emailVerified) {
            return res.status(401).json({
                code: 401,
                message: 'Email is not verified.'
            });
        }
        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        const expire = new Date();
        expire.setDate(expire.getDate() + 1);
        await models.User.update({ expire }, { where: { id: user.id } })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.setHeader("authorization", accessToken);

        // Produce a message to Kafka with full user data
        await produceMessage('user-signin', user.id, user.toJSON())

        return res.status(200).json({ success: true, accessToken, user })
    } catch (error) {
        next(error);
    }
}
const signUp = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, password } = req.body.data;

        const userByUsername = await models.User.findOne({ where: { username } });
        if (userByUsername) {
            return res.status(401).json({ code: 401, message: 'Username is already registered.' });
        }

        const userByEmail = await models.User.findOne({ where: { email } });
        if (userByEmail) {
            return res.status(401).json({ code: 401, message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await models.User.create({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            email,
            emailVerified: false
        });

        // Tạo token xác thực email
        const emailToken = jwt.sign({ id: newUser.id, username: newUser.username, email: newUser.email }, 'your-secret-key', { expiresIn: '1h' });

        // Định nghĩa URL xác thực
        const confirmationUrl = `http://localhost:4000/verify/email?token=${emailToken}`;

        // Đọc template HTML
        const templatePath = path.join(__dirname, '..', 'templates', 'verify_email_template.html');
        const htmlContent = fs.readFileSync(templatePath, 'utf8');
        const htmlWithLink = htmlContent.replace('${VERIFY_URL}', confirmationUrl);

        // Gửi email xác thực
        const mailOptions = {
            from: 'canhmail292@gmail.com',
            to: email,
            subject: 'Email Confirmation',
            html: htmlWithLink
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Confirmation email sent. Please check your email.' });
    } catch (error) {
        next(error);
    }
}
const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body.data;
        console.log(req.body.data, "req.body.data");
        if (!email) {
            return res.status(400).json({ message: 'Missing email.' });
        }

        // Find the user in the database
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        // Generate an OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Send the OTP to the user's email

        const mailOptions = {
            from: 'canhmail292@gmail.com',
            to: email,
            subject: 'Your OTP',
            text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send OTP.' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
            }
        })
    } catch (error) {
        next(error)
    }
}
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        console.log(req.data, "token")
        if (!token) {
            return res.status(400).json({ message: 'Missing token.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, 'your-secret-key');
        const { id, username, email } = decoded;

        // Find the user in the database
        const user = await models.User.findOne({ where: { id, username, email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        // Check if the email is already verified
        if (user.emailVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        // Update the user's emailVerified status
        user.emailVerified = true;
        await user.save();

        // Optionally, generate an access token for the user
        const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, 'your-secret-key', { expiresIn: '1h' });

        return res.status(200).json({ success: true, message: 'Email verified successfully.', accessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token.' });
        }
        next(error);
    }
};
const refreshToken = async (req, res, next) => {
    console.log('REFRESH TOKENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')
    try {
        console.log(req.cookies, "req.cookies");
        const refreshToken = req.cookies.refreshToken; // Lấy refreshToken từ cookie
        console.log(refreshToken, "refreshToken");
        if (!refreshToken) {
            return res.status(403).json({ error: { message: 'Unauthorized' } });
        }
        const userId = await verifyRefreshToken(refreshToken);
        console.log(userId, "userId");
        const accessToken = await signAccessToken(userId);
        // const newRefreshToken = await signRefreshToken(userId);

        // res.cookie("refreshToken", newRefreshToken, { // Đặt lại refreshToken mới
        //     httpOnly: true,
        //     maxAge: 60 * 60 * 1000,
        // });

        res.setHeader('authorization', accessToken);
        return res.status(200).json({ success: true, accessToken });
    } catch (error) {
        next(error);
    }
};
const signOut = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        console.log("TOKENNNNNNNNNNNNNNN");
        console.log(refreshToken);
        if (!refreshToken) {
            return res.status(403).json({ error: { message: 'Unauthorized' } });
        }
        const userId = await verifyRefreshToken(refreshToken);
        console.log(userId, "userId");
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: { message: 'User not found' } });
        }
        // Clear the refresh token in the cookie
        res.cookie('refreshToken', '', { expires: new Date(0) });
        res.cookie('connect.sid', '', { expires: new Date(0) }); // Đặt cookie với giá trị rỗng và thời gian hết hạn là ngay lập tức
        // Clear the refresh token and expire in the database
        user.refreshToken = null;
        user.expire = null;
        await user.save();

        // Produce a message to Kafka with full user data
        await produceMessage('user-signout', user.id, user.toJSON());

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { username, oldPassword, newPassword, reNewPassword } = req.body;
        const user = await models.User.findOne({
            where: { username }
        });
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: 'Username is not registered.'
            });
        }
        const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: 'Old password is incorrect.'
            });
        }
        if (newPassword !== reNewPassword) {
            return res.status(400).json({
                code: 400,
                message: 'New password and re-entered password do not match.'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = bcrypt.hashSync(newPassword, salt);
        await user.update({ password: hashPassword });

        // Produce a message to Kafka with full user data
        await produceMessage('password-change', user.id, user.toJSON());

        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
const signInWithGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        if (err || !user) {
            console.log(err);
            return res.redirect('http://localhost:4000');
        }
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        const expire = new Date();
        expire.setDate(expire.getDate() + 1);
        await models.User.update({ expire }, { where: { id: user.id } });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Produce a message to Kafka with full user data
        await produceMessage('google-signin', user.id, user.toJSON());

        // Trả về accessToken dưới dạng query string để lưu trữ trên client
        return res.redirect(`http://localhost:4000?accessToken=${accessToken}`);
    })(req, res, next);
};
const signInWithFacebook = passport.authenticate('facebook', { scope: ['email'] });

const facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', async (err, user, info) => {
        if (err || !user) {
            console.log(err);
            console.log(user);
            return res.redirect('http://localhost:4000');
        }
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        const expire = new Date();
        expire.setDate(expire.getDate() + 1);
        await models.User.update({ expire }, { where: { id: user.id } });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Produce a message to Kafka with full user data
        await produceMessage('facebook-signin', user.id, user.toJSON());

        // Trả về accessToken dưới dạng query string để lưu trữ trên client
        return res.redirect(`http://localhost:4000?accessToken=${accessToken}`);
    })(req, res, next);
};
module.exports = {
    signIn,
    signUp,
    verifyEmail,
    refreshToken,
    signOut,
    changePassword,
    signInWithGoogle,
    googleCallback,
    signInWithFacebook,
    facebookCallback,
    sendOTP
};
/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
const axios = require('axios')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { models } = require('../models')
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../middlewares/jwtService')
const CryptoJS = require('crypto-js')
const admin = require('../config/firebase-admin-setup')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'canhmail292@gmail.com',
    pass: 'tzgrtkohlaydvmzx'
  }
})
const signIn = async (req, res, next) => {
  try {
    const { email, password, rememberChecked } = req.body.data
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: 'Email and password are required.'
      })
    }
    const user = await models.User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: 'Username is not registered.'
      })
    }
    if (user.type === 'google') {
      return res.status(401).json({
        code: 401,
        message: 'Please sign in using Google.'
      })
    }
    if (user.type === 'github') {
      return res.status(401).json({
        code: 401,
        message: 'Please sign in using GitHub.'
      })
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: 'Password is incorrect.'
      })
    }
    if (!user.emailVerified) {
      return res.status(401).json({
        code: 401,
        message: 'Email is not verified.'
      })
    }

    const accessToken = await signAccessToken(user.id)
    let refreshToken = null

    if (rememberChecked) {
      refreshToken = await signRefreshToken(user.id)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      })
    }
    const expire = new Date()
    expire.setMonth(expire.getMonth() + 5)
    await models.User.update({ expire }, { where: { id: user.id } })
    res.setHeader('authorization', accessToken)
    const role = await models.Role.findOne({
      where: { id: user.roleId }
    })
    const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
    const userResult = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      key: encryptedRole,
      grade: user.grade,
      phone: user.phone,
      city: user.city,
      district: user.district,
      ward: user.ward,
      startPoint: user.starPoint,
      petId: user.petId,
      dob: user.birthOfDate ? user.birthOfDate.toISOString().split('T')[0] : ''
    }
    return res.status(200).json({ success: true, accessToken, user: userResult })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body.data
    const userByEmail = await models.User.findOne({ where: { email } })
    if (userByEmail) {
      return res.status(401).json({ code: 401, message: 'Email is already registered.' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await models.User.create({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      type: 'local',
      emailVerified: false,
      roleId: 3
    })
    // Tạo token xác thực email
    const emailToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

    // Định nghĩa URL xác thực
    const confirmationUrl = `https://localhost:3000/verify/email?token=${emailToken}`
    // Đọc template HTML
    const templatePath = path.join(__dirname, '..', 'templates', 'verify_email_template.html')
    const htmlContent = fs.readFileSync(templatePath, 'utf8')
    const htmlWithLink = htmlContent.replace('${VERIFY_URL}', confirmationUrl)

    // Gửi email xác thực
    const mailOptions = {
      from: 'canhmail292@gmail.com',
      to: email,
      subject: 'Email Confirmation',
      html: htmlWithLink
    }
    await transporter.sendMail(mailOptions)
    return res.status(200).json({ success: true, message: 'Confirmation email sent. Please check your email.' })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query
    console.log(token, 'token')
    if (!token) {
      return res.status(400).json({ message: 'Missing token.' })
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(decoded, 'decoded')
    const { id, email } = decoded

    const user = await models.User.findOne({ where: { id, email } })
    if (!user) {
      return res.status(400).json({ message: 'Invalid token.' })
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' })
    }
    user.emailVerified = true
    await user.save()
    // const accessToken = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' })
    const accessToken = await signAccessToken({ id: user.id, email: user.email })

    return res.status(200).json({ success: true, message: 'Email verified successfully.', accessToken })
  } catch (error) {
    console.log(error)
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired.' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token.' })
    }
    next(error)
  }
}
const refreshToken = async (req, res, next) => {
  console.log('REFRESH TOKENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')
  try {
    const refreshToken = req.cookies.refreshToken
    console.log(refreshToken, 'refreshToken')
    if (!refreshToken) {
      return res.status(403).json({ error: { message: 'Unauthorized' } })
    }
    const userId = await verifyRefreshToken(refreshToken)
    console.log(userId, 'userId')
    const accessToken = await signAccessToken(userId)
    res.setHeader('authorization', accessToken)
    console.log(accessToken)
    return res.status(200).json({ success: true, accessToken })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const signOut = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    console.log(refreshToken)
    if (!refreshToken) {
      console.log('No refresh token provided')
    } else {
      const userId = await verifyRefreshToken(refreshToken)
      const user = await models.User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: { message: 'User not found' } })
      }
      res.cookie('refreshToken', '', { expires: new Date(0) })
      res.cookie('connect.sid', '', { expires: new Date(0) })
      user.refreshToken = null
      user.expire = null
      await user.save()
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body.data
    if (!email) {
      return res.status(400).json({ message: 'Missing email.' })
    }
    const user = await models.User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'User not found.' })
    }
    return res.status(200).json({ success: true, message: 'Email found.' })
  } catch (error) {
    next(error)
  }
}
const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body.data
    console.log(req.body.data, 'req.body.data')

    if (!email) {
      return res.status(400).json({ message: 'Missing email.' })
    }

    const user = await models.User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'User not found.' })
    }

    // Kiểm tra loại tài khoản
    if (user.accountType !== 'local') {
      return res.status(400).json({ message: 'Please use Google to change your password.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpire = new Date()
    otpExpire.setMinutes(otpExpire.getMinutes() + 5)

    await models.User.update({ otp, otpExpire }, { where: { email } })

    const mailOptions = {
      from: 'canhmail292@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      html: `Dear ${user.firstName},<br>
        Thank you for using our service.<br><br>
        Please confirm your e-mail address by entering the code below into the verification form.<br><br>
        <strong>Your OTP is ${otp}. It will expire in 5 minutes.</strong><br><br>
        * This is an automated e-mail. Please do not respond to this address.<br>
        * Please disregard this message if you receive it and did not request to change your password.`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to send OTP.' })
      } else {
        console.log('Email sent: ' + info.response)
        return res.status(200).json({ success: true, message: 'OTP sent successfully.', otpExpire })
      }
    })
  } catch (error) {
    next(error)
  }
}
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body.data
    if (!email || !otp) {
      return res.status(400).json({ message: 'Missing email or OTP.' })
    }
    const user = await models.User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP.' })
    }
    if (new Date() > user.otpExpire) {
      return res.status(410).json({ message: 'OTP has expired.' })
    }
    await models.User.update({ otp: null, otpExpire: null }, { where: { email } })
    res.status(200).json({ message: 'OTP verified successfully.' })
  } catch (error) {
    next(error)
  }
}
const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params
    const { oldPassword, newPassword } = req.body
    const user = await models.User.findByPk(id)
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: 'Old password is incorrect.'
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = bcrypt.hashSync(newPassword, salt)
    await user.update({ password: hashPassword })
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body.data
    const user = await models.User.findOne({
      where: { email }
    })
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'Email is not registered.'
      })
    }
    const hashPassword = await bcrypt.hash(newPassword, 10)
    await user.update({ password: hashPassword })
    return res.status(200).json({ success: true, message: 'Password has been reset successfully.' })
  } catch (error) {
    next(error)
  }
}
// use Firebase Authentication
const signInOrRegisterWithFacebook = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({ message: 'Missing idToken' })
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    console.log(decodedToken, 'decodedToken')
    const email = decodedToken.email
    const nameParts = decodedToken.name.split(' ')
    const userInfo = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email,
      avatar: decodedToken.picture,
      type: 'facebook',
      emailVerified: true
    }
    let existingUser = await models.User.findOne({ where: { email: userInfo.email } })
    if (existingUser) {
      if (existingUser.type !== 'facebook') {
        return res.status(400).json({
          message: `Email đã được sử dụng với phương thức đăng nhập khác (${existingUser.type}). Vui lòng đăng nhập bằng phương thức đó.`
        })
      }
      await existingUser.update(userInfo)
    } else {
      userInfo.roleId = 3
      existingUser = await models.User.create(userInfo)
    }
    const accessToken = await signAccessToken(existingUser.id)
    const refreshToken = await signRefreshToken(existingUser.id)
    console.log(refreshToken, 'refreshToken')
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    const expire = new Date()
    expire.setDate(expire.getDate() + 5)
    await models.User.update({ expire }, { where: { id: existingUser.id } })
    const role = await models.Role.findOne({
      where: { id: existingUser.roleId }
    })
    const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
    const userResult = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      avatar: existingUser.avatar,
      grade: existingUser.grade,
      key: encryptedRole,
      emailVerified: true,
      starPoint: existingUser.starPoint,
      petId: existingUser.petId
    }
    return res.status(200).json({ success: true, accessToken, user: userResult })
  } catch (error) {
    console.error('Lỗi khi đăng ký với Facebook:', error)
    return res.status(500).json({ message: 'Lỗi khi đăng ký với Facebook' })
  }
}
const signInOrRegisterWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({ message: 'Missing idToken' })
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const email = decodedToken.email
    const fullName = decodedToken.name || ''
    const nameParts = fullName.split(' ')

    const userInfo = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email,
      avatar: decodedToken.picture,
      type: 'google',
      emailVerified: true
    }

    let existingUser = await models.User.findOne({ where: { email: userInfo.email } })
    if (existingUser) {
      if (existingUser.type !== 'google') {
        return res.status(400).json({
          message: `Email đã được sử dụng với phương thức đăng nhập khác (${existingUser.type}). Vui lòng đăng nhập bằng phương thức đó.`
        })
      }
      await existingUser.update(userInfo)
    } else {
      userInfo.roleId = 3
      existingUser = await models.User.create(userInfo)
    }

    const accessToken = await signAccessToken(existingUser.id)
    console.log(accessToken, 'accessTokenGoogle')
    const refreshToken = await signRefreshToken(existingUser.id)
    console.log(refreshToken, 'refreshToken')

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    const expire = new Date()
    expire.setMonth(expire.getMonth() + 1)
    await models.User.update({ expire }, { where: { id: existingUser.id } })

    res.setHeader('authorization', accessToken)
    const role = await models.Role.findOne({
      where: { id: existingUser.roleId }
    })
    const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
    const userResult = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      avatar: existingUser.avatar,
      grade: existingUser.grade,
      key: encryptedRole,
      emailVerified: true,
      starPoint: existingUser.starPoint,
      petId: existingUser.petId
    }

    return res.status(200).json({ success: true, accessToken, user: userResult })
  } catch (error) {
    console.error('Lỗi khi đăng ký với Google:', error)
    res.status(500).json({ message: 'Lỗi khi đăng ký với Google' })
  }
}

const signInOrRegisterWithGitHub = async (req, res) => {
  try {
    const { githubToken } = req.body
    console.log(req.body, 'accessToken')
    if (!githubToken) {
      return res.status(400).json({ message: 'Missing accessToken' })
    }
    const { Octokit } = await import('@octokit/rest')
    const octokit = new Octokit({ auth: githubToken })
    const { data: userData } = await octokit.rest.users.getAuthenticated()
    console.log(userData, 'userData')
    const { data: emailData } = await octokit.request('GET /user/emails')
    const primaryEmail = emailData.find((email) => email.primary).email
    const userInfo = {
      firstName: (userData.name && userData.name.split(' ')[0]) || '',
      lastName: (userData.name && userData.name.split(' ').slice(1).join(' ')) || '',
      email: primaryEmail,
      avatar: userData.avatar_url,
      type: 'github'
    }
    let existingUser = await models.User.findOne({ where: { email: userInfo.email } })
    if (existingUser) {
      if (existingUser.type !== 'github') {
        return res.status(400).json({
          message: `Email đã được sử dụng với phương thức đăng nhập khác (${existingUser.type}). Vui lòng đăng nhập bằng phương thức đó.`
        })
      }
      await existingUser.update(userInfo)
    } else {
      userInfo.roleId = 3
      existingUser = await models.User.create(userInfo)
    }
    const accessToken = await signAccessToken(existingUser.id)
    const refreshToken = await signRefreshToken(existingUser.id)
    console.log(refreshToken, 'refreshToken')
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    const expire = new Date()
    expire.setDate(expire.getDate() + 5)
    await models.User.update({ expire }, { where: { id: existingUser.id } })

    res.setHeader('authorization', accessToken)
    const role = await models.Role.findOne({
      where: { id: existingUser.roleId }
    })
    const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
    const userResult = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      grade: existingUser.grade,
      avatar: existingUser.avatar,
      key: encryptedRole,
      starPoint: existingUser.starPoint,
      petId: existingUser.petId
    }
    return res.status(200).json({ success: true, accessToken, user: userResult })
  } catch (error) {
    console.error('Error during GitHub sign in or registration:', error)
    res.status(500).json({ message: 'GitHub sign in or registration failed' })
  }
}

module.exports = {
  signIn,
  signUp,
  verifyEmail,
  refreshToken,
  signOut,
  changePassword,
  resetPassword,
  signInOrRegisterWithFacebook,
  signInOrRegisterWithGoogle,
  signInOrRegisterWithGitHub,
  sendOTP,
  verifyOTP,
  checkEmail
}

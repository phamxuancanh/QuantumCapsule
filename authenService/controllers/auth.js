const bcrypt = require('bcrypt')
const { models } = require('../models')
const client = require('../middlewares/connectRedis')
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../middlewares/jwtService')
const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body.data
        const user = await models.User.findOne({
            where: { username }
        })
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: 'Username is not registered.'
            })
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: 'Username or password is incorrect.'
            })
        }
        
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.setHeader("authorization", accessToken);
        res.setHeader("refreshToken", refreshToken);

        return res
            .status(200)
            .json({ success: true, accessToken, refreshToken, user });
    } catch (error) {
        next(error);
    }
}
const signUp = async (req, res, next) => {
    try {
        const { username, password } = req.body.data
        const user = await models.User.findOne({
            where: { username }
        })
        if (user) {
            return res.status(401).json({
                code: 401,
                message: 'Username is already registered.'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = bcrypt.hashSync(password, salt)

        const newUser = await models.User.create({
            username,
            password: hashPassword
        })
        return res.status(200).json({ success: true, user: newUser })
    } catch (error) {
        next(error)
    }
}
const refreshToken = async (req, res, next) => {
    console.log('refreshToken')
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(403).json({ error: { message: 'Unauthorized' } })
        }
        const userId = await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToken(userId)
        const newRefreshToken = await signRefreshToken(userId)
        res.setHeader('authorization', accessToken)
        return res.status(200).json({ success: true, accessToken, newRefreshToken })
    } catch (error) {
        next(error)
    }
}
const signOut = async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(403).json({ error: { message: 'Unauthorized' } })
        }
        const userId = await verifyRefreshToken(refreshToken)
        client.del(userId.toString(), (err, val) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ error: { message: 'Internal Server Error' } })
            }
            return res.status(200).json({ success: true })
        })
    } catch (error) {
        next(error)
    }
}
const changePassword = async (req, res, next) => {
    try {
        const { username, oldPassword, newPassword, reNewPassword } = req.body
        const user = await models.User.findOne({
            where: { username }
        })
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: 'Username is not registered.'
            })
        }
        const isPasswordValid = bcrypt.compareSync(oldPassword, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: 'Old password is incorrect.'
            })
        }
        if (newPassword !== reNewPassword) {
            return res.status(400).json({
                code: 400,
                message: 'New password and re-entered password do not match.'
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
module.exports = {
    signIn,
    signUp,
    refreshToken,
    signOut,
    changePassword
}
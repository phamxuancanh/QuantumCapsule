const express = require("express");
const JWT = require("jsonwebtoken");
const client = require("../middlewares/connectRedis");
const crypto = require('crypto')
const { models } = require('../models')
const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        };
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: "1h"
        };
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            // Save the access token in Redis
            client.set(userId.toString(), token, 'EX', 3600);
            resolve(token)
        })
    })
}
const verifyAccessToken = (req, res, next) => {
    const [, Authorization] = req.headers.authorization.split(' ')
    console.log(Authorization, "Authorization");
    if (!Authorization) {
        return res.status(403).json({ error: { message: "Unauthorized 1" } });
    }
    JWT.verify(Authorization, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            console.log(err, "err");
            if (err.name === "JsonWebTokenError") {
                return res.status(403).json({ error: { message: "Unauthorized 2" } });
            }
            return res.status(401).json({ error: { message: err.message } });
        }
        req.payload = payload;
        setTimeout(() => {
            next();
        }, 100);
    });
};
const signRefreshToken = async (userId) => {
    return new Promise(async (resolve, reject) => {
        // Generate a random string for the refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        try {
            // Save the refresh token in the database
            const user = await models.User.findByPk(userId);
            user.refreshToken = refreshToken;
            await user.save();
            console.log("token", refreshToken);
            resolve(refreshToken);
        } catch (err) {
            reject(err);
        }
    });
};
const verifyRefreshToken = (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Query the database for the user with the given refresh token
            const user = await models.User.findOne({ where: { refreshToken: refreshToken } });
            if (!user) {
                return reject({ status: 401, message: 'Token not found' });
            }

            // Check if the token has expired
            const now = new Date();
            if (user.expire < now) {
                return reject({ status: 401, message: 'Token has expired' });
            }

            // Resolve with the user's ID
            resolve(user.id);
        } catch (err) {
            reject(err);
        }
    });
};
module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
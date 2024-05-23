const express = require("express");
const JWT = require("jsonwebtoken");
const client = require("../middlewares/connectRedis");

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        };
        const secret = process.env.ACCESS_TOKEN_SECRET
        console.log(secret, "secret");
        const options = {
            expiresIn: "5m",
        };
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};
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
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        };
        const secret = "secret";
        const options = {
            expiresIn: "5h",
        };
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            // Set the Redis expiration time to 5 hours in seconds
            client.set(
                userId.toString(),
                token,
                "EX",
                5 * 60 * 60,
                (err, reply) => {
                    if (err) return reject(err);
                    resolve(token);
                }
            );
        });
    });
};
const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(
            refreshToken,
            "secret",
            (err, payload) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                client.get(payload.userId, (err, reply) => {
                    if (err) return reject(err);
                    if (refreshToken === reply) {
                        return resolve(payload);
                    }
                    console.log("k co token");
                    return reject(err);
                });
            }
        );
    });
};
module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
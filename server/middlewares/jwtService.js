/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-promise-reject-errors */
// const express = require('express')
const JWT = require('jsonwebtoken')
const client = require('../middlewares/connectRedis')
const crypto = require('crypto')
const { models } = require('../models')
const signAccessToken = async (userId) => {
  const payload = {
    userId
  }
  const secret = process.env.ACCESS_TOKEN_SECRET
  const options = {
    expiresIn: '2h'
  }

  try {
    const token = await new Promise((resolve, reject) => {
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err)
        resolve(token)
      })
    })

    await client.set(userId.toString(), token, 'EX', 2 * 60 * 60)
    return token
  } catch (error) {
    throw new Error('Error signing access token')
  }
}

// const verifyAccessToken = (req, res, next) => {
//   const [, Authorization] = req.headers.authorization.split(' ')
//   console.log(Authorization, 'Authorization')
//   if (!Authorization) {
//     return res.status(401).json({ error: { message: 'Unauthorized 1' } })
//   }
//   JWT.verify(Authorization, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
//     if (err) {
//       console.log(err, 'err')
//       if (err.name === 'JsonWebTokenError') {
//         return res.status(401).json({ error: { message: 'Unauthorized 2' } })
//       }
//       return res.status(401).json({ error: { message: err.message } })
//     }
//     req.payload = payload
//     setTimeout(() => {
//       next()
//     }, 100)
//   })
// }
// const verifyAccessToken = (req, res, next) => {
//   const authHeader = req.headers.authorization

//   // Kiểm tra xem header authorization có tồn tại hay không
//   if (!authHeader) {
//     return res.status(401).json({ error: { message: 'Unauthorized 1' } })
//   }
//   // Tách chuỗi 'Bearer' và token
//   const [scheme, token] = authHeader.split(' ')
//   // Kiểm tra định dạng token có đúng là 'Bearer <token>' hay không
//   if (scheme !== 'Bearer' || !token) {
//     return res.status(401).json({ error: { message: 'Unauthorized 1' } })
//   }
//   // Xác minh token bằng JWT và chỉ định thuật toán
//   JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] }, (err, payload) => {
//     console.log(token, 'token')
//     if (err) {
//       console.log(err, 'err')
//       if (err.name === 'JsonWebTokenError') {
//         return res.status(401).json({ error: { message: 'Unauthorized 2' } })
//       }
//       return res.status(401).json({ error: { message: err.message } })
//     }
//     req.payload = payload
//     setTimeout(() => {
//       next()
//     }, 100)
//   })
// }
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  // Kiểm tra xem header authorization có tồn tại hay không
  if (!authHeader) {
    return res.status(401).json({ error: { message: 'Unauthorized 1' } })
  }

  // Tách chuỗi 'Bearer' và token
  const [scheme, token] = authHeader.split(' ')

  // Kiểm tra định dạng token có đúng là 'Bearer <token>' hay không
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: { message: 'Unauthorized 1' } })
  }

  // Xác minh token bằng JWT và chỉ định thuật toán
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] }, (err, payload) => {
    console.log(token, 'token')
    if (err) {
      console.log(err, 'err')
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: { message: 'Unauthorized 2' } })
      }
      return res.status(401).json({ error: { message: err.message } })
    }

    // Lấy userId từ payload
    const { userId } = payload
    if (!userId) {
      return res.status(401).json({ error: { message: 'Unauthorized 3' } })
    }

    // Gắn userId vào request object
    req.userId = userId
    req.payload = payload

    setTimeout(() => {
      next()
    }, 100)
  })
}
const signRefreshToken = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const refreshToken = crypto.randomBytes(64).toString('hex')

    try {
      const user = await models.User.findByPk(userId)
      user.refreshToken = refreshToken
      await user.save()
      resolve(refreshToken)
    } catch (err) {
      reject(err)
    }
  })
}
const verifyRefreshToken = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await models.User.findOne({ where: { refreshToken } })
      if (!user) {
        return reject({ status: 403, message: 'Token not found' })
      }
      console.log(user)
      const now = new Date()
      if (user.expire < now) {
        console.log('Token has expired')
        user.expire = null
        await user.save()
        return reject({ status: 403, message: 'Token has expired' })
      }
      resolve(user.id)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}

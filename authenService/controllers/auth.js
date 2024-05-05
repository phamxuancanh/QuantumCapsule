const express = require('express')
const { models } = require('../models')
const bcrypt = require('bcrypt')
const randToken = require('rand-token')
const { errorLogger, infoLogger } = require('../logs/logger')

const {
  SALT_KEY,
  generateToken,
  REFRESH_TOKEN_SIZE,
  decodeToken
} = require('../utils')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body.data
    console.log(username)
    const user = await models.User.findOne({
      where: { username }
    })

    if (user) {
      res.status(409).json({
        code: 409,
        message: 'Create new account failed.'
      })
    } else {
      const hashPassword = bcrypt.hashSync(password, SALT_KEY)
      const newUser = {
        username,
        password: hashPassword
      }
      const createdUser = await models.User.create(newUser)
      if (!createdUser) {
        return res.status(400).json({
          code: 400,
          message: 'Create new account failed.'
        })
      }
      return res.json({
        username,
        status: 'Register success!'
      })
    }
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body.data
    const user = await models.User.findOne({
      where: { username }
    })
    if (!user) {
      errorLogger.error({
        message: 'Login failed!',
        path: '/login',
        method: 'POST'
      })
      return res.status(401).json({
        code: 401,
        message: 'Login failed.'
      })
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      errorLogger.error({
        message: 'Login failed!',
        path: '/login',
        method: 'POST'
      })
      return res.status(401).json({
        code: 401,
        message: 'Login failed.'
      })
    }
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    const dataForAccessToken = {
      id: user.id
    }
    const accessToken = await generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    )
    console.log(accessToken)
    if (!accessToken) {
      errorLogger.error({
        message: 'Create access token failed!',
        path: '/login',
        method: 'POST',
        obj: { username }
      })
      return res
        .status(401)
        .json({ code: 401, message: 'Login failed.' })
    }

    let refreshToken = randToken.generate(REFRESH_TOKEN_SIZE)
    if (!user.refreshToken) {
      user.set({
        refreshToken
      })
      await user.save()
    } else {
      refreshToken = user.refreshToken
    }
    infoLogger.info({
      message: 'Login success!',
      path: '/login',
      method: 'POST',
      obj: { username }
    })
    return res.json({
      accessToken,
      refreshToken,
      username
    })
  } catch (error) {
    errorLogger.error({
      message: 'Login failed!',
      path: '/login',
      method: 'POST'
    })
    res.json({ error })
  }
})

router.post('/refresh', async (req, res) => {
  const [, accessTokenFromHeader] = req.headers.authorization.split(' ')
  if (!accessTokenFromHeader) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid access token.'
    })
  }

  const refreshTokenFromBody = req.body.data?.refreshToken
  if (!refreshTokenFromBody) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid access token.'
    })
  }

  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

  const decoded = await decodeToken(accessTokenFromHeader, accessTokenSecret)
  if (!decoded) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid access token.'
    })
  }

  const userId = decoded.payload.id

  const user = await models.User.findOne({
    where: {
      id: userId
    }
  })
  if (!user) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid access token.'
    })
  }

  if (refreshTokenFromBody !== user.refreshToken) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid refresh token!'
    })
  }

  const dataForAccessToken = {
    id: userId
  }

  const accessToken = await generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  )
  if (!accessToken) {
    return res.status(400).json({
      code: 400,
      message: 'Create access token failed! Please try again!'
    })
  }
  return res.json({
    accessToken
  })
})

module.exports = router

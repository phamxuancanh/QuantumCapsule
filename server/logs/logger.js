const winston = require('winston')
const moment = require('moment-timezone')

const infoLogger = winston.createLogger({
  level: 'info',
  format: winston.format.printf((info) => {
    let message = `${moment().tz('Asia/Ho_Chi_Minh').format()} | ${info.level.toUpperCase()} | ${info.message} | `

    message = info.method ? message + `method:${info.method} | ` : message
    message = info.endpoint ? message + `endpoint:${info.endpoint} | ` : message
    message = info.request ? message + `request:${JSON.stringify(info.request)} | ` : message
    message = info.response ? message + `response:${JSON.stringify(info.response)} | ` : message
    message = info.user ? message + `user:${info.user}` : message
    return message
  }),
  transports: [
    new winston.transports.File({ filename: 'logs/log_success.json', level: 'info' })
  ]
})

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.printf((info) => {
    let message = `${moment().tz('Asia/Ho_Chi_Minh').format()} | ${info.level.toUpperCase()} | ${info.message} | `
    message = info.method ? message + `method:${info.method} | ` : message
    message = info.endpoint ? message + `endpoint:${info.endpoint} | ` : message
    message = info.request ? message + `request:${JSON.stringify(info.request)} | ` : message
    message = info.error ? message + `error:${JSON.stringify(info.error)} | ` : message
    message = info.user ? message + `user:${info.user}` : message
    return message
  }),
  transports: [
    new winston.transports.File({ filename: 'logs/log_error.json', level: 'error' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  infoLogger.add(new winston.transports.Console({
    level: 'info',
    format: winston.format.simple()
  }))

  errorLogger.add(new winston.transports.Console({
    level: 'error',
    format: winston.format.simple()
  }))
}

module.exports = { infoLogger, errorLogger }

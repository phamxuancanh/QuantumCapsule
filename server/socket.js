// socket.js
let io

function init (server) {
  io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  })
}

function getIO () {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}

module.exports = { init, getIO }

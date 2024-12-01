let io

function init (server) {
  io = require('socket.io')(server, {
    cors: {
      origin: ['https://quantum-capsule.vercel.app', 'http://localhost:3000', 'http://3.27.217.226:3000'], // Thêm localhost
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

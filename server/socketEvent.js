const { getIO } = require('./socket')

const connectedUsers = {} // Đối tượng để lưu trữ thông tin người dùng đã kết nối

function socketEvents () {
  const io = getIO()

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
    connectedUsers[socket.id] = socket // Thêm người dùng vào danh sách

    // Gửi danh sách người dùng đã kết nối cho tất cả các client
    io.emit('userList', Object.keys(connectedUsers))
    console.log('Connected users:', Object.keys(connectedUsers))

    socket.on('message', (data) => {
      console.log('Message received: ', data)
      socket.emit('message', 'Hello from server')
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
      delete connectedUsers[socket.id] // Xóa người dùng khỏi danh sách

      // Gửi danh sách người dùng đã kết nối cập nhật cho tất cả các client
      io.emit('userList', Object.keys(connectedUsers))
    })
  })
}

module.exports = socketEvents

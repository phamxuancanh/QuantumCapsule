const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json') // Đọc từ cùng thư mục

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = admin

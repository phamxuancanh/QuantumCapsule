/* eslint-disable n/handle-callback-err */
const redis = require('redis')
const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1'
})
client.ping((err, pong) => {
  console.log(pong)
})
client.on('error', (error) => {
  console.log(error)
})
client.on('connect', (error) => {
  console.log('connected')
})
client.on('ready', (error) => {
  console.log('Redis to ready')
})
module.exports = client

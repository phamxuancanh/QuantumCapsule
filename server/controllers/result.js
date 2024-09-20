const { models } = require('../models')

const insertResult = async (req, res, next) => {
  try {
    const { result } = req.body
    console.log('--------->', result)
    if (!result) {
      return res
        .status(400)
        .json({ message: 'Invalid data format or empty data' })
    }

    const resData = await models.Scoresheet.create(result)

    res
      .status(201)
      .json({ message: 'nộp kết quả thành công', data: resData })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
module.exports = {
  insertResult
}

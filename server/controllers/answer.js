const { models } = require('../models')

const insertListAnswer = async (req, res, next) => {
  try {
    const { listAnswer } = req.body
    if (!Array.isArray(listAnswer) || listAnswer.length === 0) {
      return res
        .status(400)
        .json({ message: 'Invalid data format or empty array' })
    }

    const newList = await models.Answer.bulkCreate(listAnswer.map(answer => ({
      ...answer,
      scoresheetId: answer.resultId
    })))

    res
      .status(201)
      .json({ message: 'list Answer added successfully', data: newList })
  } catch (error) {
    console.error('Error adding Answers:', error)
    res.status(500).json({ message: error.message })
  }
}
module.exports = {
  insertListAnswer
}

const { models } = require('../models')
const { Sequelize } = require('sequelize')
const insertResult = async (req, res, next) => {
  try {
    const { result } = req.body
    if (!result) {
      return res
        .status(400)
        .json({ message: 'Invalid data format or empty data' })
    }

    const resData = await models.Result.create(result)

    res
      .status(201)
      .json({ message: 'nộp kết quả thành công', data: resData })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getListResultByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ message: 'Invalid data format or empty data' })
    }
    const listResult = await models.Result.findAll({
      where: {
        userId
      }
    })
    res.status(200).json({ message: 'success', data: listResult })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getResultDetail = async (req, res, next) => {
  try {
    console.log('-------getResultDetail')
    const { resultId } = req.params
    if (!resultId) {
      return res.status(400).json({ message: 'Invalid data format' })
    }

    const result = await models.Result.findOne({
      where: {
        id: resultId
      }
    })
    const listAnswer = await models.Answer.findAll({
      where: {
        resultId
      }
    })
    const listQuestion = await models.Question.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: Sequelize.literal(
            `(SELECT questionId FROM answers WHERE resultId= '${resultId}')`
          )
        }
      }
    })
    console.log('listQuestion', listQuestion)

    res.status(200).json({ message: 'success', data: { result, listAnswer, listQuestion } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
module.exports = {
  insertResult,
  getResultDetail,
  getListResultByUserId
}

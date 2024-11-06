const { queries } = require('../helpers/QueryHelper')
const { models, sequelize } = require('../models')
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
    const query = queries.getStarPointOfUser
    // Thực hiện truy vấn
    const resultQuery = await sequelize.query(query, {
      replacements: { userId: result.userId },
      type: sequelize.QueryTypes.SELECT
    })
    const starPoint = resultQuery[0].starPoint ?? 0
    await models.User.update(
      { starPoint },
      {
        where: {
          id: result.userId
        }
      }
    )

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
    let { from, to } = req.query

    if (!userId) {
      return res.status(400).json({ message: 'Invalid data format or empty data' })
    }

    // Set default values for from and to if they are not provided
    from = from || null
    to = to || null

    let dateFilter = ''
    if (from && to) {
      dateFilter = 'AND r.createdAt BETWEEN :from AND :to'
    }

    const query = `
      SELECT r.*, e.name AS examName, c.name as chapterName, l.name as lessonName
      FROM results r
      JOIN exams e ON r.examId = e.id
      left join chapters c on e.chapterId = c.id
      left join lessons l on e.lessonId = l.id
      WHERE r.userId = :userId
      ${dateFilter}
      order by r.timeStart desc;
    `

    const resultQuery = await sequelize.query(query, {
      replacements: { userId, from, to },
      type: sequelize.QueryTypes.SELECT
    })

    res.status(200).json({ message: 'success', data: resultQuery })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const getListUniqueDoneResultByUserIdandChapterId = async (req, res, next) => {
  try {
    const loginedUserId = req.userId
    const { chapterId, from, to } = req.query

    if (!loginedUserId) {
      return res.status(400).json({ message: 'Invalid data format or empty data' })
    }

    let dateFilter = ''
    if (from && to) {
      dateFilter = 'AND r.createdAt BETWEEN :from AND :to'
    }

    const query = `
      SELECT DISTINCT
        r.resultId, 
        r.userId, 
        r.examId, 
        r.lessonId, 
        r.chapterId,
        r.star,
        r.totalScore,
        r.yourScore,
        r.type
      FROM (
        SELECT 
          r.id AS resultId, 
          r.userId, 
          r.examId, 
          e.lessonId, 
          l.chapterId,
          r.star,
          r.totalScore,
          r.yourScore,
          CASE 
            WHEN e.lessonId IS NULL THEN 'exam' 
            ELSE 'exercise' 
          END AS type,
          ROW_NUMBER() OVER (PARTITION BY r.examId ORDER BY r.yourScore / r.totalScore DESC, r.id) AS rn
        FROM 
          Results r
        JOIN 
          Exams e ON r.examId = e.id
        LEFT JOIN 
          Lessons l ON e.lessonId = l.id
        WHERE 
          r.userId = :userId
          ${chapterId ? 'AND (l.chapterId = :chapterId OR e.chapterId = :chapterId)' : ''}
          ${dateFilter}
      ) r
      WHERE r.rn = 1
    `

    const replacements = { userId: loginedUserId }
    if (chapterId) {
      replacements.chapterId = chapterId
    }
    if (from && to) {
      replacements.from = from
      replacements.to = to
    }

    const resultQuery = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    })

    const exercises = resultQuery.filter(result => result.type === 'exercise')
    const exams = resultQuery.filter(result => result.type === 'exam')

    res.status(200).json({ message: 'success', data: { exercises, exams } })
  } catch (error) {
    console.error('Error fetching results:', error)
    res.status(500).json({ message: 'Internal server error' })
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
  getListResultByUserId,
  getListUniqueDoneResultByUserIdandChapterId
}

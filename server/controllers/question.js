const { models } = require('../models')
const { Op } = require('sequelize')

const importQuestions = async (req, res, next) => {
  try {
    const { questions } = req.body
    console.log('questions', questions)
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid data format or empty array' })
    }

    const lessonIds = questions.map(question => question.lessonId).filter(id => id)

    if (lessonIds.length > 0) {
      const existingLessons = await models.Lesson.findAll({
        where: {
          id: {
            [Op.in]: lessonIds
          }
        }
      })

      const existingLessonIds = new Set(existingLessons.map(lesson => lesson.id))

      const allLessonIdsExist = lessonIds.every(lessonId => existingLessonIds.has(lessonId))

      if (!allLessonIdsExist) {
        return res.status(400).json({ message: 'One or more lessonId do not exist in lessons table' })
      }
    }

    const newQuestions = await models.Question.bulkCreate(questions)

    res.status(201).json({ message: 'Questions added successfully', data: newQuestions })
  } catch (error) {
    console.error('Error adding questions:', error)
    res.status(500).json({ message: 'Error adding questions' })
  }
}
// get list questions by many conditions
const getListQuestion = async (req, res, next) => {
  try {
    const {
      page = '1',
      size = '15',
      search: contentCondition,
      lessonId,
      questionType,
      examId
    } = req.query

    const offset = (Number(page) - 1) * Number(size)

    const searchConditions = {
      where: {},
      include: []
    }

    if (contentCondition) {
      searchConditions.where.content = {
        [Op.like]: `%${contentCondition}%`
      }
    }

    if (lessonId) {
      searchConditions.where.lessonId = lessonId
    }

    if (questionType) {
      searchConditions.where.questionType = questionType
    }

    if (examId) {
      searchConditions.include.push({
        model: models.Exam,
        where: { id: examId },
        through: { attributes: [] },
        attributes: []
      })
    }

    const totalRecords = await models.Question.count(searchConditions)
    const questions = await models.Question.findAll({
      ...searchConditions,
      limit: Number(size),
      offset,
      attributes: [
        'id',
        'lessonId',
        'questionType',
        'title',
        'content',
        'contentImg',
        'A',
        'B',
        'C',
        'D',
        'E',
        'correctAnswer',
        'explainAnswer',
        'status'
      ]
    })

    res.json({ data: questions, totalRecords })
  } catch (error) {
    console.error('Error getting questions:', error)
    res.status(500).json({ message: 'Error getting questions' })
  }
}
module.exports = {
  importQuestions,
  getListQuestion
}

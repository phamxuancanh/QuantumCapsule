const { models, sequelize } = require('../models')
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
// add a new question
const addQuestion = async (req, res, next) => {
  try {
    const questionData = req.body

    const { lessonId } = questionData

    // Check if the lesson exists
    const lesson = await models.Lesson.findByPk(lessonId)

    if (!lesson) {
      return res.status(400).json({ message: 'Lesson not found' })
    }

    const newQuestion = await models.Question.create(questionData)
    res.status(201).json({ message: 'Question added successfully', data: newQuestion })
  } catch (error) {
    console.error('Error adding question:', error)
    res.status(500).json({ message: 'Error adding question' })
  }
}
// update question by id
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const question = await models.Question.findByPk(id)
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    await question.update(updateData)
    res.json({ message: 'Question updated successfully', data: question })
  } catch (error) {
    console.error('Error updating question:', error)
    res.status(500).json({ message: 'Error updating question' })
  }
}
// delete question by id
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params

    const question = await models.Question.findByPk(id)
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    await question.update({ status: 0 })
    res.json({ message: 'Question status updated to 0 successfully' })
  } catch (error) {
    console.error('Error updating question status:', error)
    res.status(500).json({ message: 'Error updating question status' })
  }
}
// get list questions by examId
const getListQuestionByExamId = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = `
      SELECT q.id, q.lessonId, q.questionType, q.title, q.content, q.contentImg, q.A, q.B, q.C, q.D, q.E, q.correctAnswer, q.explainAnswer, q.status
      FROM Questions q
      INNER JOIN Exam_Questions eq ON q.id = eq.questionId
      WHERE eq.examId = :examId
    `

    // Thực hiện truy vấn
    const listQuestions = await sequelize.query(query, {
      replacements: { examId: id }, // Thay thế examId trong câu truy vấn
      type: sequelize.QueryTypes.SELECT // Đảm bảo rằng kết quả trả về là dạng SELECT
    })
    res.json({ data: listQuestions })
  } catch (error) {
    console.error('Error getting questions by examId:', error)
    res.status(500).json({ message: 'Error getting questions by examId' })
  }
}

module.exports = {
  importQuestions,
  getListQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getListQuestionByExamId
}

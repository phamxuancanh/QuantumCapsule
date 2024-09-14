const { models } = require('../models')
const { Op } = require('sequelize')

// import exam questions data
const importExamQuestions = async (req, res, next) => {
  try {
    const { examQuestions } = req.body
    console.log('examQuestions', examQuestions)
    if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
      return res.status(400).json({ message: 'Invalid data format or empty array' })
    }

    const examIds = examQuestions.map(eq => eq.examId)
    const questionIds = examQuestions.map(eq => eq.questionId)

    const existingExams = await models.Exam.findAll({
      where: {
        id: {
          [Op.in]: examIds
        }
      }
    })

    const existingQuestions = await models.Question.findAll({
      where: {
        id: {
          [Op.in]: questionIds
        }
      }
    })

    const existingExamIds = new Set(existingExams.map(exam => exam.id))
    const existingQuestionIds = new Set(existingQuestions.map(question => question.id))

    const allExamIdsExist = examIds.every(examId => existingExamIds.has(examId))
    const allQuestionIdsExist = questionIds.every(questionId => existingQuestionIds.has(questionId))

    if (!allExamIdsExist || !allQuestionIdsExist) {
      return res.status(400).json({ message: 'One or more examId or questionId do not exist in exams or questions table' })
    }

    const newExamQuestions = await models.ExamQuestion.bulkCreate(examQuestions)

    res.status(201).json({ message: 'Exam questions added successfully', data: newExamQuestions })
  } catch (error) {
    console.error('Error adding exam questions:', error)
    res.status(500).json({ message: 'Error adding exam questions' })
  }
}

module.exports = {
  importExamQuestions
}

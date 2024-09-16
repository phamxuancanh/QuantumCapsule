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
// add a new exam question
const addExamQuestion = async (req, res, next) => {
  try {
    const examQuestionData = req.body

    const { examId, questionId } = examQuestionData

    // Check if the exam and question exist
    const exam = await models.Exam.findByPk(examId)
    const question = await models.Question.findByPk(questionId)

    if (!exam || !question) {
      return res.status(400).json({ message: 'Exam or Question not found' })
    }

    const newExamQuestion = await models.ExamQuestion.create(examQuestionData)
    res.status(201).json({ message: 'Exam question added successfully', data: newExamQuestion })
  } catch (error) {
    console.error('Error adding exam question:', error)
    res.status(500).json({ message: 'Error adding exam question' })
  }
}
// update an exam question by id
const updateExamQuestion = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const examQuestion = await models.ExamQuestion.findByPk(id)
    if (!examQuestion) {
      return res.status(404).json({ message: 'Exam question not found' })
    }

    await examQuestion.update(updateData)
    res.json({ message: 'Exam question updated successfully', data: examQuestion })
  } catch (error) {
    console.error('Error updating exam question:', error)
    res.status(500).json({ message: 'Error updating exam question' })
  }
}
// delete an exam question by id
const deleteExamQuestion = async (req, res, next) => {
  try {
    const { id } = req.params

    const examQuestion = await models.ExamQuestion.findByPk(id)
    if (!examQuestion) {
      return res.status(404).json({ message: 'Exam question not found' })
    }

    await examQuestion.update({ status: 0 })
    res.json({ message: 'Exam question status updated to 0 successfully' })
  } catch (error) {
    console.error('Error updating exam question status:', error)
    res.status(500).json({ message: 'Error updating exam question status' })
  }
}
module.exports = {
  importExamQuestions,
  addExamQuestion,
  updateExamQuestion,
  deleteExamQuestion
}

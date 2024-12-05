const { queries } = require('../helpers/QueryHelper')
const { models, sequelize } = require('../models')
const { Op } = require('sequelize')

const checkQuestionsExist = async (questions, lessonId, chapterId) => {
  const query = `
    select * from questions
    where 
      status = 1 and
      ${lessonId ? 'lessonId = :lessonId' : ''}
      ${chapterId ? 'chapterId = :chapterId' : ''}
  `
  const replacements = {}
  if (lessonId) replacements.lessonId = lessonId
  if (chapterId) replacements.chapterId = chapterId
  const listQuestionBank = await sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT
  })

  return questions.map(question => {
    const found = listQuestionBank.some(bankQuestion =>
      question.questionType === bankQuestion.questionType &&
          question.title === bankQuestion.title &&
          question.content === bankQuestion.content &&
          question.contentImg === bankQuestion.contentImg &&
          question.A === bankQuestion.A &&
          question.B === bankQuestion.B &&
          question.C === bankQuestion.C &&
          question.D === bankQuestion.D &&
          question.E === bankQuestion.E &&
          question.correctAnswer === bankQuestion.correctAnswer
    )
    return { question, exists: found }
  })
}
const importQuestions = async (req, res, next) => {
  try {
    const { questions, lessonId, chapterId } = req.body
    if (lessonId || chapterId) {
      const questionExists = await checkQuestionsExist(questions, lessonId, chapterId)
      const exists = questionExists?.filter(q => q.exists)
      if (exists.length > 0) {
        return res.status(400).json({ message: 'Có câu hỏi đã tồn tại trong ngân hàng câu hỏi' })
      }
    }
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
      where: {
        status: 1 // Chỉ lấy những question có status là 1
      },
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

    const { lessonId, chapterId } = questionData

    // Check if the lesson exists
    const lesson = await models.Lesson.findByPk(lessonId)
    const chapter = await models.Chapter.findByPk(chapterId)

    if (!lesson && !chapter) {
      return res.status(400).json({ message: 'Không tìm thấy bài học hoặc chương' })
    }
    if (lessonId || chapterId) {
      const questionExists = await checkQuestionsExist([questionData], lessonId, chapterId)
      const exists = questionExists.filter(q => q.exists)
      if (exists.length > 0) {
        return res.status(400).json({ message: 'Có câu hỏi đã tồn tại trong ngân hàng câu hỏi' })
      }
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
    const query = queries.getListQuestionByExamId

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
const getListQuestionByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const query = queries.getListQuestionByChapterId

    // Thực hiện truy vấn
    const listQuestions = await sequelize.query(query, {
      replacements: { chapterId }, // Thay thế chapterId trong câu truy vấn
      type: sequelize.QueryTypes.SELECT // Đảm bảo rằng kết quả trả về là dạng SELECT
    })
    res.json({ data: listQuestions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const getListQuestionByLessonId = async (req, res, next) => {
  try {
    const { lessonId } = req.params

    const query = queries.getListQuestionByLessonId

    // Thực hiện truy vấn
    const listQuestions = await sequelize.query(query, {
      replacements: { lessonId }, // Thay thế chapterId trong câu truy vấn
      type: sequelize.QueryTypes.SELECT // Đảm bảo rằng kết quả trả về là dạng SELECT
    })
    res.json({ data: listQuestions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const getListQuestionBank = async (req, res, next) => {
  try {
    const { examId } = req.params

    let query = ''
    let replacements = ''

    const exam = await models.Exam.findByPk(examId)
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }
    if (exam.lessonId) {
      query = `
        SELECT q.*
        FROM questions q
        WHERE q.lessonId = :lessonId and q.status =1 
          AND q.id NOT IN (
            SELECT eq.questionId
            FROM exam_questions eq
            WHERE eq.examId = :examId
              and eq.status =1
          )
          order by q.updatedAt desc
      `
      replacements = { lessonId: exam.lessonId, examId }
    }
    if (exam.chapterId) {
      query = `
        SELECT q.*
        FROM questions q
        WHERE q.chapterId = :chapterId and q.status =1 
          AND q.id NOT IN (
            SELECT eq.questionId
            FROM exam_questions eq
            WHERE eq.examId = :examId
              and eq.status =1
          )
          order by q.updatedAt desc
      `
      replacements = { chapterId: exam.chapterId, examId }
    }

    // Thực hiện truy vấn
    const listQuestions = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    })
    res.json({ data: listQuestions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  importQuestions,
  getListQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getListQuestionByExamId,
  getListQuestionByChapterId,
  getListQuestionByLessonId,
  getListQuestionBank
}

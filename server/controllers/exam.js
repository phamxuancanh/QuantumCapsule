const { queries } = require('../helpers/QueryHelper')
const { models, sequelize } = require('../models')
const { Op } = require('sequelize')
const ExamQuestion = require('../models/exam_question')

// import exams data
const importExams = async (req, res, next) => {
  try {
    const { exams } = req.body
    console.log('exams', exams)
    if (!Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({ message: 'Invalid data format or empty array' })
    }
    const lessonIds = exams.map(exam => exam.lessonId).filter(id => id)
    const chapterIds = exams.map(exam => exam.chapterId).filter(id => id)
    const existingLessons = await models.Lesson.findAll({
      where: {
        id: {
          [Op.in]: lessonIds
        }
      }
    })
    const existingChapters = await models.Chapter.findAll({
      where: {
        id: {
          [Op.in]: chapterIds
        }
      }
    })
    const existingLessonIds = new Set(existingLessons.map(lesson => lesson.id))
    const existingChapterIds = new Set(existingChapters.map(chapter => chapter.id))
    const allLessonIdsExist = lessonIds.every(lessonId => existingLessonIds.has(lessonId))
    const allChapterIdsExist = chapterIds.every(chapterId => existingChapterIds.has(chapterId))
    if (!allLessonIdsExist || !allChapterIdsExist) {
      return res.status(400).json({ message: 'One or more lessonId or chapterId do not exist in lessons or chapters table' })
    }
    const newExams = await models.Exam.bulkCreate(exams)
    res.status(201).json({ message: 'Exams added successfully', data: newExams })
  } catch (error) {
    console.error('Error adding exams:', error)
    res.status(500).json({ message: 'Error adding exams' })
  }
}
// get list exams by many conditions
const getListExam = async (req, res, next) => {
  try {
    const {
      page = '1',
      size = '15',
      search: nameCondition,
      lessonId,
      chapterId
    } = req.query

    const offset = (Number(page) - 1) * Number(size)

    const searchConditions = {
      where: {}
    }

    if (nameCondition) {
      searchConditions.where.name = {
        [Op.like]: `%${nameCondition}%`
      }
    }

    if (lessonId) {
      searchConditions.where.lessonId = lessonId
    }

    if (chapterId) {
      searchConditions.where.chapterId = chapterId
    }

    const totalRecords = await models.Exam.count(searchConditions)
    const exams = await models.Exam.findAll({
      ...searchConditions,
      limit: Number(size),
      offset,
      attributes: [
        'id',
        'name',
        'order',
        'lessonId',
        'chapterId',
        'name',
        'status',
        'createdAt',
        'updatedAt'
      ]
    })

    res.json({ data: exams, totalRecords })
  } catch (error) {
    console.error('Error fetching exams:', error)
    res.status(500).json({ message: 'Error fetching exams' })
  }
}
// add a new exam
const addExam = async (req, res, next) => {
  try {
    const examData = req.body

    const { lessonId, chapterId } = examData

    // Check if the lesson and chapter exist
    const lesson = await models.Lesson.findByPk(lessonId)
    const chapter = await models.Chapter.findByPk(chapterId)

    if (!lesson && !chapter) {
      return res.status(400).json({ message: 'Lesson or Chapter not found' })
    }

    const newExam = await models.Exam.create(examData)
    res.status(201).json({ message: 'Exam added successfully', data: newExam })
  } catch (error) {
    console.error('Error adding exam:', error)
    res.status(500).json({ message: 'Error adding exam' })
  }
}
// update an exam by id
const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const exam = await models.Exam.findByPk(id)
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }

    await exam.update(updateData)
    res.json({ message: 'Exam updated successfully', data: exam })
  } catch (error) {
    console.error('Error updating exam:', error)
    res.status(500).json({ message: 'Error updating exam' })
  }
}
// delete an exam by id
const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params

    const exam = await models.Exam.findByPk(id)
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }

    await exam.update({ status: 0 })
    res.json({ message: 'Exam status updated to 0 successfully' })
  } catch (error) {
    console.error('Error updating exam status:', error)
    res.status(500).json({ message: 'Error updating exam status' })
  }
}
// get exams by lessonId
const getExamsByLessonId = async (req, res, next) => {
  try {
    const { lessonId } = req.params

    const exams = await models.Exam.findAll({
      where: {
        lessonId
      },
      attributes: [
        'id',
        'name',
        'order',
        'lessonId',
        'chapterId',
        'name',
        'status',
        'createdAt',
        'updatedAt'
      ]
    })

    res.json({ exams })
  } catch (error) {
    console.error('Error fetching exams:', error)
    res.status(500).json({ message: 'Error fetching exams' })
  }
}
// get exams by chapterId
const getExamsByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const exams = await models.Exam.findAll({
      where: {
        chapterId
      },
      attributes: [
        'id',
        'name',
        'order',
        'lessonId',
        'chapterId',
        'name',
        'status',
        'createdAt',
        'updatedAt'
      ]
    })

    res.json({ exams })
  } catch (error) {
    console.error('Error fetching exams:', error)
    res.status(500).json({ message: 'Error fetching exams' })
  }
}

const getListExamByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const query = queries.getListExamByChapterId

    // Thực hiện truy vấn
    const listExams = await sequelize.query(query, {
      replacements: { chapterId }, // Thay thế examId trong câu truy vấn
      type: sequelize.QueryTypes.SELECT // Đảm bảo rằng kết quả trả về là dạng SELECT
    })
    res.json({ data: listExams })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const getListExamByLessonId = async (req, res, next) => {
  try {
    const { lessonId } = req.params

    const query = queries.getListExamByLessonId

    // Thực hiện truy vấn
    const listExams = await sequelize.query(query, {
      replacements: { lessonId }, // Thay thế examId trong câu truy vấn
      type: sequelize.QueryTypes.SELECT // Đảm bảo rằng kết quả trả về là dạng SELECT
    })
    res.json({ data: listExams })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// #region exam_question
const getListExamQuestionByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const query = queries.getListExamQuestionByChapterId

    // Thực hiện truy vấn
    const listExamQuestions = await sequelize.query(query, {
      replacements: { chapterId }, // Thay thế examId trong câu truy vấn
      type: sequelize.QueryTypes.SELECT // Đảm bảo rằng kết quả trả về là dạng SELECT
    })
    res.json({ data: listExamQuestions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const insertExamQuestion = async (req, res, next) => {
  try {
    const { examId, questionId } = req.body
    const examQuestion = await models.ExamQuestion.create({ examId, questionId })
    res.status(201).json({ message: 'Exam Question added successfully', data: examQuestion })
  } catch (error) {
    console.error('Error adding exam question:', error)
    res.status(500).json({ message: 'Error adding exam question' })
  }
}
const deleteExamQuestion = async (req, res, next) => {
  try {
    const { id } = req.params

    const examQuestion = await models.ExamQuestion.findByPk(id)
    if (!examQuestion) {
      return res.status(404).json({ message: 'Không tìm thấy' })
    }
    // update status 0
    await examQuestion.update({ status: 0 })
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    res.status(500).json({ message: 'lỗi khi xóa: ' + error.message })
  }
}
const updateExamQuestion = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body
    const examQuestion = await models.ExamQuestion.findOne({ where: { id } })
    console.log('--------------updateData', updateData, examQuestion)
    if (!examQuestion) {
      return res.status(404).json({ message: 'Không tìm thấy' })
    }

    await ExamQuestion.update(
      { ...updateData, updatedAt: new Date() },
      {
        where: {
          id
        }
      }
    )
    res.json({ message: 'Cập nhật thành công', data: examQuestion })
  } catch (error) {
    res.status(500).json({ message: 'lỗi khi cập nhật: ' + error.message })
  }
}
const getExercisesByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params
    const query = `
      SELECT e.*
      FROM exams e
      JOIN lessons l ON e.lessonId = l.id
      JOIN chapters c ON l.chapterId = c.id
      WHERE c.id = :chapterId
    `
    const listExams = await sequelize.query(query, {
      replacements: { chapterId },
      type: sequelize.QueryTypes.SELECT
    })
    res.json({ data: listExams })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// #endregion

module.exports = {
  importExams,
  getListExam,
  addExam,
  updateExam,
  deleteExam,
  getExamsByLessonId,
  getExamsByChapterId,
  getListExamByChapterId,
  getListExamByLessonId,
  getExercisesByChapterId,
  // exam_question
  getListExamQuestionByChapterId,
  insertExamQuestion,
  deleteExamQuestion,
  updateExamQuestion
}

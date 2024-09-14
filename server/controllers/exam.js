const { models } = require('../models')
const { Op } = require('sequelize')

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

module.exports = {
  importExams
}

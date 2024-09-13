const { models } = require('../models')
const { Op } = require('sequelize')

// import lessons data
const importLessons = async (req, res, next) => {
  try {
    const { lessons } = req.body
    if (!Array.isArray(lessons) || lessons.length === 0) {
      return res.status(400).json({ message: 'Invalid data format or empty array' })
    }
    const chapterIds = lessons.map(lesson => lesson.chapterId)
    console.log('chapterIds', chapterIds)
    const existingChapters = await models.Chapter.findAll({
      where: {
        id: {
          [Op.in]: chapterIds
        }
      }
    })
    console.log('existingChapters', existingChapters)
    const existingChapterIds = new Set(existingChapters.map(chapter => chapter.id))
    const allChapterIdsExist = chapterIds.every(chapterId => existingChapterIds.has(chapterId))
    if (!allChapterIdsExist) {
      return res.status(400).json({ message: 'One or more chapterId do not exist in chapters table' })
    }
    const newLessons = await models.Lesson.bulkCreate(lessons)
    res.status(201).json({ message: 'Lessons added successfully', data: newLessons })
  } catch (error) {
    console.error('Error adding lessons:', error)
    res.status(500).json({ message: 'Error adding lessons' })
  }
}

module.exports = {
  importLessons
}

module.exports = {
  importLessons
}

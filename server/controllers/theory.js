const { models } = require('../models')
const { Op } = require('sequelize')

// import theories data
const importTheories = async (req, res, next) => {
  try {
    const { theories } = req.body
    if (!Array.isArray(theories) || theories.length === 0) {
      return res.status(400).json({ message: 'Invalid data format or empty array' })
    }
    const lessonIds = theories.map(theory => theory.lessonId)
    console.log('lessonIds', lessonIds)
    const existingLessons = await models.Lesson.findAll({
      where: {
        id: {
          [Op.in]: lessonIds
        }
      }
    })
    console.log('existingLessons', existingLessons)
    const existingLessonIds = new Set(existingLessons.map(lesson => lesson.id))
    const allLessonIdsExist = lessonIds.every(lessonId => existingLessonIds.has(lessonId))
    if (!allLessonIdsExist) {
      return res.status(400).json({ message: 'One or more lessonId do not exist in lessons table' })
    }

    const newTheories = await models.Theory.bulkCreate(theories)

    res.status(201).json({ message: 'Theories added successfully', data: newTheories })
  } catch (error) {
    console.error('Error adding theories:', error)
    res.status(500).json({ message: 'Error adding theories' })
  }
}

module.exports = {
  importTheories
}

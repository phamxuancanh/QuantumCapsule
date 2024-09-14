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

module.exports = {
  importQuestions
}

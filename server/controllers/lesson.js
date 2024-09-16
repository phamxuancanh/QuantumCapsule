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
// get list lessons by many conditions
const getListLesson = async (req, res, next) => {
  try {
    const {
      page = '1',
      size = '15',
      search: nameCondition,
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

    if (chapterId) {
      searchConditions.where.chapterId = chapterId
    }

    const totalRecords = await models.Lesson.count(searchConditions)
    const lessons = await models.Lesson.findAll({
      ...searchConditions,
      limit: Number(size),
      offset,
      attributes: [
        'id',
        'chapterId',
        'name',
        'order',
        'status',
        'createdAt',
        'updatedAt'
      ]
    })

    res.json({ data: lessons, totalRecords })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    res.status(500).json({ message: 'Error fetching lessons' })
  }
}
// add a new lesson
const addLesson = async (req, res, next) => {
  try {
    const lessonData = req.body

    const { chapterId } = lessonData

    // Check if the chapter exists
    const chapter = await models.Chapter.findByPk(chapterId)

    if (!chapter) {
      return res.status(400).json({ message: 'Chapter not found' })
    }

    const newLesson = await models.Lesson.create(lessonData)
    res.status(201).json({ message: 'Lesson added successfully', data: newLesson })
  } catch (error) {
    console.error('Error adding lesson:', error)
    res.status(500).json({ message: 'Error adding lesson' })
  }
}
// update lesson by id
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const lesson = await models.Lesson.findByPk(id)
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    await lesson.update(updateData)
    res.json({ message: 'Lesson updated successfully', data: lesson })
  } catch (error) {
    console.error('Error updating lesson:', error)
    res.status(500).json({ message: 'Error updating lesson' })
  }
}
// delete lesson by id
const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params

    const lesson = await models.Lesson.findByPk(id)
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    await lesson.update({ status: 0 })
    res.json({ message: 'Lesson status updated to 0 successfully' })
  } catch (error) {
    console.error('Error updating lesson status:', error)
    res.status(500).json({ message: 'Error updating lesson status' })
  }
}
module.exports = {
  importLessons,
  getListLesson,
  addLesson,
  updateLesson,
  deleteLesson
}

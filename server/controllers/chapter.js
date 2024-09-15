const { models } = require('../models')
const { Op } = require('sequelize')
// init chapters data
const importChapters = async (req, res, next) => {
  try {
    const { chapters } = req.body
    console.log('chapters', chapters)
    if (!Array.isArray(chapters) || chapters.length === 0) {
      return res.status(400).json({ message: 'Invalid data format or empty array' })
    }

    const newChapters = await models.Chapter.bulkCreate(chapters)

    res.status(201).json({ message: 'Chapters added successfully', data: newChapters })
  } catch (error) {
    console.error('Error adding chapters:', error)
    res.status(500).json({ message: 'Error adding chapters' })
  }
}
// get list chapters by many conditions
const getListChapter = async (req, res, next) => {
  try {
    const {
      page = '1',
      size = '15',
      search: nameCondition,
      subjectId,
      grade
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

    if (subjectId) {
      searchConditions.where.subjectId = subjectId
    }

    if (grade) {
      searchConditions.where.grade = grade
    }
    const totalRecords = await models.Chapter.count(searchConditions)
    const chapters = await models.Chapter.findAll({
      ...searchConditions,
      limit: Number(size),
      offset,
      attributes: [
        'id',
        'subjectId',
        'name',
        'description',
        'grade',
        'order',
        'status',
        'createdAt',
        'updatedAt'
      ]
    })

    res.json({
      page: Number(page),
      size: Number(size),
      totalRecords,
      data: chapters
    })
  } catch (error) {
    console.error('Error fetching chapters:', error)
    res.status(500).json({ message: 'Error fetching chapters' })
  }
}

module.exports = {
  importChapters,
  getListChapter
}

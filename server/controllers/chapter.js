const { models } = require('../models')
const { Op } = require('sequelize')

const getAllChapter = async (req, res, next) => {
  try {
    const {
      page = '1',
      size = '15',
      search: nameCondition,
      subjectId,
      grade,
      status
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

    if (status !== undefined) {
      searchConditions.where.status = status === 'true'
    }

    // Fetch the total count of chapters with filtering conditions
    const totalRecords = await models.Chapter.count(searchConditions)

    // Fetch the chapters with limit and offset
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

    if (!chapters || chapters.length === 0) {
      return res.status(404).json({ message: 'No chapters found' })
    }

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
  getAllChapter
}

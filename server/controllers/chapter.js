const { error } = require('winston')
const { models } = require('../models')
const { Op } = require('sequelize')
// init chapters data
const importChapters = async (req, res, next) => {
  try {
    const { chapters } = req.body
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
      size = '20',
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
    res.status(500).json({ message: error.message })
  }
}
const getListAllChapter = async (req, res, next) => {
  console.log('-------------------------getListAllChapter')
  try {
    const chapters = await models.Chapter.findAll({
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
      ],
      where: {
        status: 1
      },
      order: [['updatedAt', 'DESC']]
    })

    res.json({
      data: chapters
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// add a new chapter
const addChapter = async (req, res, next) => {
  try {
    const chapterData = req.body

    const newChapter = await models.Chapter.create(chapterData)
    res.status(201).json({ message: 'Chapter added successfully', data: newChapter })
  } catch (error) {
    console.error('Error adding chapter:', error)
    res.status(500).json({ message: 'Error adding chapter' })
  }
}
// update a chapter by id
const updateChapter = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const chapter = await models.Chapter.findByPk(id)
    if (!chapter) {
      return res.status(404).json({ message: error.message })
    }

    await chapter.update(updateData)
    res.json({ message: 'Chapter updated successfully', data: chapter })
  } catch (error) {
    console.error('Error updating chapter:', error)
    res.status(500).json({ message: 'Error updating chapter' })
  }
}
// delete a chapter by id
const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params

    const chapter = await models.Chapter.findByPk(id)
    if (!chapter) {
      return res.status(404).json({ message: error.message })
    }

    await chapter.update({ status: 0 })
    res.json({ message: 'Chapter status updated to 0 successfully' })
  } catch (error) {
    console.error('Error updating chapter status:', error)
    res.status(500).json({ message: 'Error updating chapter status' })
  }
}

const getListChapterBySubjectId = async (req, res, next) => {
  try {
    const { subjectId } = req.params
    const chapters = await models.Chapter.findAll({
      where: {
        subjectId
      }
    })
    res.json({ data: chapters })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// get chapters by id
const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params
    const chapter = await models.Chapter.findByPk(id)
    if (!chapter) {
      return res.json({ data: null, message: error.message })
    }
    res.json({ chapter })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    res.status(500).json({ message: 'Error fetching chapter' })
  }
}

module.exports = {
  importChapters,
  getListChapter,
  addChapter,
  updateChapter,
  deleteChapter,
  getChapterById,
  getListChapterBySubjectId,
  getListAllChapter
}

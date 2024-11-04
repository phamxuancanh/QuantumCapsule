const { queries } = require('../helpers/QueryHelper')
const { models, sequelize } = require('../models')
const { Op } = require('sequelize')

// import theories data
const importTheories = async (req, res, next) => {
  try {
    const { theories } = req.body
    if (!Array.isArray(theories) || theories.length === 0) {
      return res.status(400).json({ message: 'Invalid data format or empty array' })
    }
    const lessonIds = theories.map(theory => theory.lessonId)
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

    const newTheories = await models.Theory.bulkCreate(theories)

    res.status(201).json({ message: 'Theories added successfully', data: newTheories })
  } catch (error) {
    console.error('Error adding theories:', error)
    res.status(500).json({ message: 'Error adding theories' })
  }
}
// get list theories by many conditions
const getListTheory = async (req, res, next) => {
  try {
    const {
      page = '1',
      size = '15',
      search: nameCondition,
      lessonId
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

    const totalRecords = await models.Theory.count(searchConditions)

    const theories = await models.Theory.findAll({
      ...searchConditions,
      limit: Number(size),
      offset,
      attributes: [
        'id',
        'lessonId',
        'name',
        'summary',
        'url',
        'type',
        'order',
        'status'
      ]
    })

    res.json({
      page: Number(page),
      size: Number(size),
      totalRecords,
      data: theories
    })
  } catch (error) {
    console.error('Error fetching theories:', error)
    res.status(500).json({ message: 'Error fetching theories' })
  }
}
// add a new theory
const addTheory = async (req, res, next) => {
  try {
    const theoryData = req.body

    const { lessonId } = theoryData

    // Check if the lesson exists
    const lesson = await models.Lesson.findByPk(lessonId)

    if (!lesson) {
      return res.status(400).json({ message: 'Lesson not found' })
    }

    const newTheory = await models.Theory.create(theoryData)
    res.status(201).json({ message: 'Theory added successfully', data: newTheory })
  } catch (error) {
    console.error('Error adding theory:', error)
    res.status(500).json({ message: 'Error adding theory' })
  }
}
// update a theory by id
const updateTheory = async (req, res, next) => {
  try {
    console.log('---------------------', req.body);
    
    const { id } = req.params
    const updateData = req.body

    const theory = await models.Theory.findByPk(id)
    if (!theory) {
      return res.status(404).json({ message: 'Theory not found' })
    }

    await theory.update(updateData)
    res.json({ message: 'Theory updated successfully', data: theory })
  } catch (error) {
    console.error('Error updating theory:', error)
    res.status(500).json({ message: 'Error updating theory' })
  }
}
// delete a theory by id
const deleteTheory = async (req, res, next) => {
  try {
    const { id } = req.params

    const theory = await models.Theory.findByPk(id)
    if (!theory) {
      return res.status(404).json({ message: 'Theory not found' })
    }

    await theory.update({ status: 0 })
    res.json({ message: 'Theory status updated to 0 successfully' })
  } catch (error) {
    console.error('Error updating theory status:', error)
    res.status(500).json({ message: 'Error updating theory status' })
  }
}
// get a theory by id
// const getTheoryById = async (req, res, next) => {
//   try {
//     const { id } = req.params

//     const theory = await models.Theory.findByPk(id, {
//       attributes: [
//         'id',
//         'lessonId',
//         'name',
//         'summary',
//         'url',
//         'type',
//         'order',
//         'status'
//       ]
//     })

//     if (!theory) {
//       return res.json({ data: null, message: 'Theory not found' })
//     }
//     res.json({ theory })
//   } catch (error) {
//     console.error('Error fetching theory:', error)
//     res.status(500).json({ message: 'Error fetching theory' })
//   }
// }
const getTheoryById = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log('id', id)
    // Tìm kiếm thông tin của Theory
    const theory = await models.Theory.findByPk(id, {
      attributes: [
        'id',
        'lessonId',
        'name',
        'summary',
        'url',
        'type',
        'order',
        'status'
      ]
    })

    if (!theory) {
      return res.json({ data: null, message: 'Theory not found' })
    }

    const lesson = await models.Lesson.findByPk(theory.lessonId, {
      attributes: ['name']
    })

    const data = {
      ...theory.dataValues,
      lessonName: lesson ? lesson.name : null
    }

    res.json({ data })
  } catch (error) {
    console.error('Error fetching theory:', error)
    res.status(500).json({ message: 'Error fetching theory' })
  }
}
// get theories by lesson id
const getTheoriesByLessonId = async (req, res, next) => {
  try {
    const { lessonId } = req.params

    const theories = await models.Theory.findAll({
      where: {
        lessonId,
        status: 1
      },
      attributes: [
        'id',
        'lessonId',
        'name',
        'summary',
        'url',
        'type',
        'order',
        'status'
      ]
    })

    res.json({ theories })
  } catch (error) {
    console.error('Error fetching theories:', error)
    res.status(500).json({ message: 'Error fetching theories' })
  }
}
const getListTheoryByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const query = queries.getListTheoryByChapterId
    const listTheory = await sequelize.query(query, {
      replacements: { chapterId }, // Thay thế chapterId trong câu truy vấn
      type: sequelize.QueryTypes.SELECT // Đảm bảo rằng kết quả trả về là dạng SELECT
    })

    res.json({ data: listTheory })
  } catch (error) {
    console.error('Error fetching theories:', error)
    res.status(500).json({ message: 'Error fetching theories' })
  }
}

module.exports = {
  importTheories,
  getListTheory,
  addTheory,
  updateTheory,
  deleteTheory,
  getTheoryById,
  getTheoriesByLessonId,
  getListTheoryByChapterId
}

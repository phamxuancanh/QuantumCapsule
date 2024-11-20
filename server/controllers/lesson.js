/* eslint-disable brace-style */
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
    const existingChapters = await models.Chapter.findAll({
      where: {
        id: {
          [Op.in]: chapterIds
        }
      }
    })
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
      where: {
        status: 1
      }
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
      order: [['order', 'ASC']],
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
const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params
    const lesson = await models.Lesson.findOne({
      where: {
        id,
        status: 1 // Chỉ lấy những lesson có status là 1
      }
    })
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found or inactive' })
    }
    res.json(lesson)
  } catch (error) {
    console.error('Error fetching lesson by id:', error)
    res.status(500).json({ message: 'Error fetching lesson by id' })
  }
}
// get list lessons by chapterId
const getLessonByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const lessons = await models.Lesson.findAll({
      where: {
        chapterId,
        status: 1 // Chỉ lấy những lesson có status là 1
      },
      order: [['order', 'ASC']], // Sắp xếp tăng dần theo trường 'order'
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

    res.json({ data: lessons })
  } catch (error) {
    console.error('Error fetching lessons by chapterId:', error)
    res.status(500).json({ message: 'Error fetching lessons by chapterId' })
  }
}
// get lessons and exams
const getLessonsandExams = async (req, res, next) => {
  try {
    const {
      page = '1',
      size = '10',
      search: nameCondition,
      type,
      subjectId,
      grade
    } = req.query

    const offset = (Number(page) - 1) * Number(size)
    const limit = Number(size)

    const searchConditions = {
      where: {
        status: 1 // Chỉ lấy những lesson và exam có status là 1
      },
      include: [
        {
          model: models.Chapter,
          where: {},
          required: false,
          include: [{
            model: models.Subject,
            attributes: ['id', 'name']
          }]
        }
      ]
    }

    if (nameCondition) {
      searchConditions.where.name = {
        [Op.like]: `%${nameCondition}%`
      }
    }

    if (subjectId) {
      searchConditions.include[0].where.subjectId = subjectId
    }
    if (grade) {
      searchConditions.include[0].where.grade = grade
    }

    const mapResultsWithSubject = (results, type) => {
      return results.map(result => {
        let subjectId = null
        let subjectName = null

        // Lấy subjectId và subjectName từ Chapter của Exam
        if (result.Chapter && result.Chapter.Subject) {
          subjectId = result.Chapter.Subject.id
          subjectName = result.Chapter.Subject.name
        }

        let entryType = type

        // Nếu Exam là Exercise, lấy Chapter và Subject qua Lesson
        if (type === 'Exam') {
          if (result.lessonId && !result.chapterId) {
            entryType = 'Exercise'

            // Kiểm tra Lesson và lấy Chapter, Subject từ Lesson nếu có
            if (result.Lesson) {
              if (result.Lesson.Chapter) {
                result.chapterId = result.Lesson.chapterId // Lấy chapterId từ Lesson
                if (result.Lesson.Chapter.Subject) {
                  subjectId = result.Lesson.Chapter.Subject.id
                  subjectName = result.Lesson.Chapter.Subject.name
                }
              }
            }
          } else if (result.chapterId && !result.lessonId) {
            entryType = 'Exam'
          } else {
            entryType = 'Exam'
          }
        }

        return {
          ...result.dataValues,
          subjectId,
          subjectName,
          type: entryType
        }
      })
    }

    if (type === 'lesson') {
      const totalLessons = await models.Lesson.count(searchConditions)

      const lessons = await models.Lesson.findAll({
        ...searchConditions,
        limit,
        offset,
        attributes: ['id', 'name', 'order', 'status', 'createdAt', 'updatedAt']
      })

      const lessonsWithType = mapResultsWithSubject(lessons, 'Lesson')

      return res.json({
        data: lessonsWithType,
        totalLessons,
        totalExams: 0,
        totalRecords: totalLessons,
        currentPage: Number(page),
        size: limit
      })
    } else if (type === 'exam') {
      const totalExams = await models.Exam.count(searchConditions)

      const exams = await models.Exam.findAll({
        ...searchConditions,
        include: [
          ...searchConditions.include,
          {
            model: models.Lesson,
            required: false,
            attributes: ['id', 'chapterId'],
            include: [
              {
                model: models.Chapter,
                required: false,
                include: [{
                  model: models.Subject,
                  attributes: ['id', 'name']
                }]
              }
            ]
          }
        ],
        limit,
        offset,
        attributes: ['id', 'name', 'lessonId', 'chapterId', 'order', 'status', 'createdAt', 'updatedAt']
      })

      const examsWithType = mapResultsWithSubject(exams, 'Exam')

      return res.json({
        data: examsWithType,
        totalLessons: 0,
        totalExams,
        totalRecords: totalExams,
        currentPage: Number(page),
        size: limit
      })
    }

    const totalLessons = await models.Lesson.count(searchConditions)
    const totalExams = await models.Exam.count(searchConditions)
    const totalRecords = totalLessons + totalExams

    if (offset >= totalRecords) {
      return res.json({
        data: [],
        totalLessons,
        totalExams,
        totalRecords,
        currentPage: Number(page),
        size: limit
      })
    }

    let combinedResults = []

    if (offset < totalLessons) {
      const lessons = await models.Lesson.findAll({
        ...searchConditions,
        limit,
        offset,
        attributes: ['id', 'name', 'order', 'status', 'createdAt', 'updatedAt']
      })

      const lessonsWithType = mapResultsWithSubject(lessons, 'Lesson')

      combinedResults = [...lessonsWithType]
    }

    if (combinedResults.length < limit) {
      const remainingLimit = limit - combinedResults.length
      const examOffset = Math.max(0, offset - totalLessons)

      const exams = await models.Exam.findAll({
        ...searchConditions,
        include: [
          ...searchConditions.include,
          {
            model: models.Lesson,
            required: false,
            attributes: ['id', 'chapterId'],
            include: [
              {
                model: models.Chapter,
                required: false,
                include: [{
                  model: models.Subject,
                  attributes: ['id', 'name']
                }]
              }
            ]
          }
        ],
        limit: remainingLimit,
        offset: examOffset,
        attributes: ['id', 'name', 'lessonId', 'chapterId', 'order', 'status', 'createdAt', 'updatedAt']
      })

      const examsWithType = mapResultsWithSubject(exams, 'Exam')

      combinedResults = [...combinedResults, ...examsWithType]
    }

    res.json({
      data: combinedResults,
      totalLessons,
      totalExams,
      totalRecords,
      currentPage: Number(page),
      size: limit
    })
  } catch (error) {
    console.error('Error searching lessons and exams:', error)
    res.status(500).json({ message: 'Error searching lessons and exams' })
  }
}

const getFirstLessonByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params

    const lesson = await models.Lesson.findOne({
      where: {
        chapterId,
        status: 1 // Chỉ lấy những lesson có status là 1
      },
      attributes: [
        'id',
        'chapterId',
        'name',
        'order',
        'status',
        'createdAt',
        'updatedAt'
      ],
      order: [['order', 'ASC']],
      limit: 1
    })

    res.json({ data: lesson })
  } catch (error) {
    console.error('Error fetching first lesson by chapterId:', error)
    res.status(500).json({ message: 'Error fetching first lesson by chapterId' })
  }
}
// get suggestions
const getSuggestions = async (req, res, next) => {
  try {
    console.log('RUNNING getSuggestions')
    const { search } = req.query
    console.log('req.query:', req.query)
    console.log('search:', search)
    if (!search) {
      return res.json({ suggestions: [] })
    }

    const searchConditions = {
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        status: 1 // Chỉ lấy những lesson và exam có status là 1
      },
      limit: 10,
      attributes: ['id', 'name']
    }

    // Fetch lessons
    const lessons = await models.Lesson.findAll(searchConditions)

    // Fetch exams with additional attributes to determine type
    const exams = await models.Exam.findAll({
      ...searchConditions,
      attributes: ['id', 'name', 'lessonId', 'chapterId']
    })

    // Map lessons to suggestions
    const lessonSuggestions = lessons.map((lesson) => ({
      id: lesson.id,
      name: lesson.name,
      type: 'Lesson'
    }))

    // Map exams to suggestions with type 'Exam' or 'Exercise'
    const examSuggestions = exams.map((exam) => {
      let examType = 'Exam'

      if (exam.lessonId && !exam.chapterId) {
        examType = 'Exercise'
      } else if (exam.chapterId && !exam.lessonId) {
        examType = 'Exam'
      }

      return {
        id: exam.id,
        name: exam.name,
        type: examType
      }
    })

    const suggestions = [
      ...lessonSuggestions,
      ...examSuggestions
    ]

    res.json({ suggestions })
  } catch (error) {
    console.error('Error getting suggestions:', error)
    res.status(500).json({ message: 'Error getting suggestions' })
  }
}

const getListLessonByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params
    const lessons = await models.Lesson.findAll({
      where: {
        chapterId,
        status: 1 // Chỉ lấy những lesson có status là 1
      },
      order: [['order', 'ASC']], // Sắp xếp tăng dần theo trường 'order'
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
    res.json({ data: lessons })
  } catch (error) {
    console.error('Error fetching lessons by chapterId:', error)
    res.status(500).json({ message: 'Error fetching lessons by chapterId' })
  }
}

module.exports = {
  importLessons,
  getListLesson,
  addLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  getLessonByChapterId,
  getLessonsandExams,
  getSuggestions,
  getFirstLessonByChapterId,
  getListLessonByChapterId
}

/* eslint-disable brace-style */
const { models, sequelize } = require('../models')
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
// const getLessonsandExams = async (req, res, next) => {
//   try {
//     // Lấy các tham số từ query
//     const {
//       page = '1',
//       size = '10',
//       search: nameCondition,
//       type,
//       subjectId,
//       grade
//     } = req.query

//     const offset = (Number(page) - 1) * Number(size)
//     const limit = Number(size)

//     // Cấu hình các điều kiện tìm kiếm chung
//     const baseSearchConditions = {
//       where: {
//         status: 1 // Chỉ lấy những lesson và exam có status là 1
//       },
//       include: [
//         {
//           model: models.Chapter,
//           where: {},
//           required: false,
//           include: [{
//             model: models.Subject,
//             attributes: ['id', 'name'],
//             where: {}, // Thêm điều kiện where cho Subject
//             required: false
//           }]
//         }
//       ]
//     }

//     // Áp dụng điều kiện tìm kiếm theo tên nếu có
//     if (nameCondition) {
//       baseSearchConditions.where.name = {
//         [Op.like]: `%${nameCondition}%`
//       }
//     }

//     // Áp dụng điều kiện tìm kiếm theo subjectId nếu có
//     if (subjectId) {
//       baseSearchConditions.include[0].include[0].where.id = subjectId
//     }

//     // Áp dụng điều kiện tìm kiếm theo grade nếu có
//     if (grade) {
//       baseSearchConditions.include[0].where.grade = grade
//     }

//     // Hàm để ánh xạ kết quả và thêm thông tin Subject và loại
//     const mapResultsWithSubject = (results, type) => {
//       return results.map(result => {
//         let subjectId = null
//         let subjectName = null

//         // Lấy subjectId và subjectName từ Chapter của Exam hoặc Lesson
//         if (result.Chapter && result.Chapter.Subject) {
//           subjectId = result.Chapter.Subject.id
//           subjectName = result.Chapter.Subject.name
//         }

//         // Nếu Exam có liên kết đến Lesson, lấy thông tin Subject từ Lesson
//         if (result.Lesson && result.Lesson.Chapter && result.Lesson.Chapter.Subject) {
//           subjectId = result.Lesson.Chapter.Subject.id
//           subjectName = result.Lesson.Chapter.Subject.name
//         }

//         return {
//           ...result.dataValues,
//           subjectId,
//           subjectName,
//           type // Đặt loại là 'Lesson' hoặc 'Exam'
//         }
//       })
//     }

//     // Xử lý theo type nếu được cung cấp
//     if (type === 'lesson') {
//       // Đếm tổng số Lessons thỏa mãn điều kiện
//       const totalLessons = await models.Lesson.count(baseSearchConditions)

//       // Lấy danh sách Lessons thỏa mãn điều kiện với phân trang
//       const lessons = await models.Lesson.findAll({
//         ...baseSearchConditions,
//         limit,
//         offset,
//         attributes: ['id', 'name', 'order', 'status', 'createdAt', 'updatedAt']
//       })

//       // Ánh xạ kết quả và thêm loại 'Lesson'
//       const lessonsWithType = mapResultsWithSubject(lessons, 'Lesson')

//       return res.json({
//         data: lessonsWithType,
//         totalLessons,
//         totalExams: 0,
//         totalRecords: totalLessons,
//         currentPage: Number(page),
//         size: limit
//       })
//     } else if (type === 'exam') {
//       // Đếm tổng số Exams thỏa mãn điều kiện
//       const totalExams = await models.Exam.count(baseSearchConditions)

//       // Lấy danh sách Exams thỏa mãn điều kiện với phân trang
//       const exams = await models.Exam.findAll({
//         ...baseSearchConditions,
//         include: [
//           ...baseSearchConditions.include,
//           {
//             model: models.Lesson,
//             required: false,
//             attributes: ['id', 'chapterId'],
//             include: [
//               {
//                 model: models.Chapter,
//                 required: false,
//                 include: [{
//                   model: models.Subject,
//                   attributes: ['id', 'name'],
//                   required: false
//                 }]
//               }
//             ]
//           }
//         ],
//         limit,
//         offset,
//         attributes: ['id', 'name', 'lessonId', 'chapterId', 'order', 'status', 'createdAt', 'updatedAt']
//       })

//       // Ánh xạ kết quả và thêm loại 'Exam'
//       const examsWithType = mapResultsWithSubject(exams, 'Exam')

//       return res.json({
//         data: examsWithType,
//         totalLessons: 0,
//         totalExams,
//         totalRecords: totalExams,
//         currentPage: Number(page),
//         size: limit
//       })
//     }

//     // Khi không có type cụ thể, kết hợp cả Lessons và Exams

//     // Đếm tổng số Lessons và Exams thỏa mãn điều kiện
//     const [totalLessons, totalExams] = await Promise.all([
//       models.Lesson.count(baseSearchConditions),
//       models.Exam.count(baseSearchConditions)
//     ])

//     const totalRecords = totalLessons + totalExams

//     // Kiểm tra nếu offset vượt quá tổng số bản ghi
//     if (offset >= totalRecords) {
//       return res.json({
//         data: [],
//         totalLessons,
//         totalExams,
//         totalRecords,
//         currentPage: Number(page),
//         size: limit
//       })
//     }

//     let combinedResults = []

//     // Tính toán các điều kiện riêng cho Lessons và Exams
//     const lessonConditions = {
//       ...baseSearchConditions,
//       limit,
//       offset,
//       attributes: ['id', 'name', 'order', 'status', 'createdAt', 'updatedAt']
//     }

//     const examConditions = {
//       ...baseSearchConditions,
//       include: [
//         ...baseSearchConditions.include,
//         {
//           model: models.Lesson,
//           required: false,
//           attributes: ['id', 'chapterId'],
//           include: [
//             {
//               model: models.Chapter,
//               required: false,
//               include: [{
//                 model: models.Subject,
//                 attributes: ['id', 'name'],
//                 required: false
//               }]
//             }
//           ]
//         }
//       ],
//       limit,
//       offset: Math.max(0, offset - totalLessons),
//       attributes: ['id', 'name', 'lessonId', 'chapterId', 'order', 'status', 'createdAt', 'updatedAt']
//     }

//     // Nếu offset nằm trong phạm vi Lessons
//     if (offset < totalLessons) {
//       const lessons = await models.Lesson.findAll({
//         ...lessonConditions
//       })

//       const lessonsWithType = mapResultsWithSubject(lessons, 'Lesson')
//       combinedResults = [...lessonsWithType]
//     }

//     // Nếu cần lấy thêm Exams để đủ số lượng limit
//     if (combinedResults.length < limit && totalExams > 0) {
//       const remainingLimit = limit - combinedResults.length

//       const exams = await models.Exam.findAll({
//         ...examConditions,
//         limit: remainingLimit
//       })

//       const examsWithType = mapResultsWithSubject(exams, 'Exam')
//       combinedResults = [...combinedResults, ...examsWithType]
//     }

//     // Trả về kết quả kết hợp
//     res.json({
//       data: combinedResults,
//       totalLessons,
//       totalExams,
//       totalRecords,
//       currentPage: Number(page),
//       size: limit
//     })
//   } catch (error) {
//     console.error('Error searching lessons and exams:', error)
//     res.status(500).json({ message: 'Error searching lessons and exams' })
//   }
// }
const getLessonsandExams = async (req, res, next) => {
  try {
    // Lấy các tham số từ query
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

    // Cấu hình các điều kiện tìm kiếm chung
    const baseSearchConditions = {
      where: {
        status: 1 // Chỉ lấy những lesson và exam có status là 1
      },
      include: [
        {
          model: models.Chapter,
          where: {},
          required: true, // Đặt required: true để đảm bảo chỉ lấy những bản ghi có Chapter
          include: [{
            model: models.Subject,
            attributes: ['id', 'name'],
            where: {}, // Thêm điều kiện where cho Subject
            required: true // Đặt required: true để chỉ lấy những bản ghi có Subject
          }]
        }
      ]
    }

    // Áp dụng điều kiện tìm kiếm theo tên nếu có
    if (nameCondition) {
      baseSearchConditions.where.name = {
        [Op.like]: `%${nameCondition}%`
      }
    }

    // Áp dụng điều kiện tìm kiếm theo subjectId nếu có
    if (subjectId && subjectId !== 'all') {
      baseSearchConditions.include[0].include[0].where.id = subjectId
    }

    // Áp dụng điều kiện tìm kiếm theo grade nếu có
    if (grade) {
      baseSearchConditions.include[0].where.grade = grade
    }

    // Hàm để ánh xạ kết quả và thêm thông tin Subject và loại
    const mapResultsWithSubject = (results, type) => {
      return results.map(result => {
        let subjectId = null
        let subjectName = null

        // Lấy subjectId và subjectName từ Chapter của Exam hoặc Lesson
        if (result.Chapter && result.Chapter.Subject) {
          subjectId = result.Chapter.Subject.id
          subjectName = result.Chapter.Subject.name
        }

        // Nếu Exam có liên kết đến Lesson, lấy thông tin Subject từ Lesson
        if (result.Lesson && result.Lesson.Chapter && result.Lesson.Chapter.Subject) {
          subjectId = result.Lesson.Chapter.Subject.id
          subjectName = result.Lesson.Chapter.Subject.name
        }

        return {
          ...result.dataValues,
          subjectId,
          subjectName,
          type // Đặt loại là 'Lesson' hoặc 'Exam'
        }
      })
    }

    // Xử lý theo type nếu được cung cấp
    if (type === 'lesson') {
      // Đếm tổng số Lessons thỏa mãn điều kiện
      const totalLessons = await models.Lesson.count(baseSearchConditions)

      // Lấy danh sách Lessons thỏa mãn điều kiện với phân trang
      const lessons = await models.Lesson.findAll({
        ...baseSearchConditions,
        limit,
        offset,
        attributes: ['id', 'name', 'order', 'status', 'createdAt', 'updatedAt']
      })

      // Ánh xạ kết quả và thêm loại 'Lesson'
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
      // Đếm tổng số Exams thỏa mãn điều kiện
      const totalExams = await models.Exam.count(baseSearchConditions)

      // Lấy danh sách Exams thỏa mãn điều kiện với phân trang
      const exams = await models.Exam.findAll({
        ...baseSearchConditions,
        include: [
          ...baseSearchConditions.include,
          {
            model: models.Lesson,
            required: false,
            attributes: ['id', 'chapterId'],
            include: [
              {
                model: models.Chapter,
                required: true, // Đảm bảo rằng Lesson có Chapter
                include: [{
                  model: models.Subject,
                  attributes: ['id', 'name'],
                  required: true // Đảm bảo rằng Chapter có Subject
                }]
              }
            ]
          }
        ],
        limit,
        offset,
        attributes: ['id', 'name', 'lessonId', 'chapterId', 'order', 'status', 'createdAt', 'updatedAt']
      })

      // Ánh xạ kết quả và thêm loại 'Exam'
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

    // Khi không có type cụ thể, kết hợp cả Lessons và Exams

    // Đếm tổng số Lessons và Exams thỏa mãn điều kiện
    const [totalLessons, totalExams] = await Promise.all([
      models.Lesson.count(baseSearchConditions),
      models.Exam.count(baseSearchConditions)
    ])

    const totalRecords = totalLessons + totalExams

    // Kiểm tra nếu offset vượt quá tổng số bản ghi
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

    // Tính toán các điều kiện riêng cho Lessons và Exams
    const lessonConditions = {
      ...baseSearchConditions,
      limit,
      offset,
      attributes: ['id', 'name', 'order', 'status', 'createdAt', 'updatedAt']
    }

    const examConditions = {
      ...baseSearchConditions,
      include: [
        ...baseSearchConditions.include,
        {
          model: models.Lesson,
          required: false,
          attributes: ['id', 'chapterId'],
          include: [
            {
              model: models.Chapter,
              required: true, // Đảm bảo rằng Lesson có Chapter
              include: [{
                model: models.Subject,
                attributes: ['id', 'name'],
                required: true // Đảm bảo rằng Chapter có Subject
              }]
            }
          ]
        }
      ],
      limit,
      offset: Math.max(0, offset - totalLessons),
      attributes: ['id', 'name', 'lessonId', 'chapterId', 'order', 'status', 'createdAt', 'updatedAt']
    }

    // Nếu offset nằm trong phạm vi Lessons
    if (offset < totalLessons) {
      const lessons = await models.Lesson.findAll({
        ...lessonConditions
      })

      const lessonsWithType = mapResultsWithSubject(lessons, 'Lesson')
      combinedResults = [...lessonsWithType]
    }

    // Nếu cần lấy thêm Exams để đủ số lượng limit
    if (combinedResults.length < limit && totalExams > 0) {
      const remainingLimit = limit - combinedResults.length

      const exams = await models.Exam.findAll({
        ...examConditions,
        limit: remainingLimit
      })

      const examsWithType = mapResultsWithSubject(exams, 'Exam')
      combinedResults = [...combinedResults, ...examsWithType]
    }

    // Trả về kết quả kết hợp
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

const getListLessonByFilterParams = async (req, res, next) => {
  try {
    const { chapterId, grade, subjectId } = req.query
    console.log('------------------:', chapterId, grade, subjectId)
    if (!((subjectId && grade) || chapterId)) {
      return res.status(400).json({ message: 'Thiếu điều kiện lọc' })
    }
    const query = `
          select l.* from lessons l
          join chapters c on l.chapterId = c.id
          where 
            ${subjectId ? 'c.subjectId = :subjectId and' : ''} 
            ${grade ? 'c.grade = :grade and' : ''} 
            ${chapterId ? 'l.chapterId = :chapterId and' : ''} 
            l.status = 1 and
            c.status = 1
          order by l.updatedAt desc
        `
    const replacements = {}
    if (subjectId) replacements.subjectId = subjectId
    if (grade) replacements.grade = grade
    if (chapterId) replacements.chapterId = chapterId
    console.log(replacements)
    console.log(query)

    const listLesson = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    })
    console.log(listLesson)
    return res.status(200).json({ message: 'Lấy dữ liệu thành công', data: listLesson })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
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
  getListLessonByChapterId,
  getListLessonByFilterParams
}

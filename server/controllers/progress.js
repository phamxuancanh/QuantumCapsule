const { models } = require('../models')
const { Op } = require('sequelize')
const addProgress = async (req, res, next) => {
  try {
    const loginedUserId = req.userId
    const { theoryId } = req.body
    if (!loginedUserId || !theoryId) {
      return res.status(400).json({ message: 'Missing userId or theoryId' })
    }
    const existingProgress = await models.Progress.findOne({
      where: { userId: loginedUserId, theoryId }
    })
    if (existingProgress) {
      return res.status(200).json({ message: 'Progress already exists', data: existingProgress })
    }
    const newProgress = await models.Progress.create({ userId: loginedUserId, theoryId })
    res
      .status(201)
      .json({ message: 'Progress added successfully', data: newProgress })
  } catch (error) {
    console.error('Error adding Progress:', error)
    res.status(500).json({ message: error.message })
  }
}
// const findProgressByGradeAndSubject = async (req, res, next) => {
//   try {
//     const { grade, subjectId } = req.query
//     console.log('grade:', grade)
//     console.log('subjectId:', subjectId)
//     if (!grade || !subjectId) {
//       return res.status(400).json({ message: 'Missing grade or subjectId' })
//     }

//     const parsedGrade = parseInt(grade, 10)
//     if (isNaN(parsedGrade)) {
//       return res.status(400).json({ message: 'Invalid grade value' })
//     }
//     const progressList = await models.Progress.findAll({
//       include: [
//         {
//           model: models.Theory,
//           required: true,
//           include: [
//             {
//               model: models.Lesson,
//               required: true,
//               include: [
//                 {
//                   model: models.Chapter,
//                   required: true,
//                   where: {
//                     grade: parsedGrade,
//                     subjectId
//                   }
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     })

//     return res.status(200).json({
//       message: 'Progress retrieved successfully',
//       data: progressList
//     })
//   } catch (error) {
//     console.error('Error finding Progress:', error.message)
//     return res.status(500).json({ message: 'An error occurred while retrieving progress', error: error.message })
//   }
// }
const findProgressByGradeAndSubject = async (req, res, next) => {
  try {
    const loginedUserId = req.userId
    const { grade, subjectId } = req.query
    console.log('grade:', grade)
    console.log('subjectId:', subjectId)
    if (!grade || !subjectId) {
      return res.status(400).json({ message: 'Missing grade or subjectId' })
    }

    const parsedGrade = parseInt(grade, 10)
    if (isNaN(parsedGrade)) {
      return res.status(400).json({ message: 'Invalid grade value' })
    }

    const progressList = await models.Progress.findAll({
      where: {
        userId: loginedUserId // Thêm điều kiện where để chỉ lấy progress của user đã đăng nhập
      },
      include: [
        {
          model: models.Theory,
          required: true,
          attributes: ['id'], // Chỉ bao gồm trường 'id' của Theory
          include: [
            {
              model: models.Lesson,
              required: true,
              include: [
                {
                  model: models.Chapter,
                  required: true,
                  where: {
                    grade: parsedGrade,
                    subjectId
                  }
                }
              ]
            }
          ]
        }
      ]
    })

    const theoryIds = progressList.map(progress => progress.Theory.id)

    return res.status(200).json({
      message: 'Progress retrieved successfully',
      data: theoryIds
    })
  } catch (error) {
    console.error('Error finding Progress:', error.message)
    return res.status(500).json({ message: 'An error occurred while retrieving progress', error: error.message })
  }
}
const findProgressByChapter = async (req, res, next) => {
  try {
    const loginedUserId = req.userId
    const { chapterId, from, to } = req.query
    console.log('chapterId:', chapterId)

    if (!chapterId) {
      return res.status(400).json({ message: 'Missing chapterId' })
    }

    const whereClause = {
      userId: loginedUserId
    }

    if (from && to) {
      whereClause.createdAt = {
        [Op.between]: [new Date(from), new Date(to)]
      }
    }

    const progressList = await models.Progress.findAll({
      where: whereClause,
      include: [
        {
          model: models.Theory,
          required: true,
          attributes: ['id', 'name'], // Include 'name' attribute
          include: [
            {
              model: models.Lesson,
              required: true,
              include: [
                {
                  model: models.Chapter,
                  required: true,
                  where: {
                    id: chapterId
                  }
                }
              ]
            }
          ]
        }
      ]
    })

    const theoryData = progressList.map(progress => ({
      id: progress.Theory.id,
      name: progress.Theory.name
    }))

    return res.status(200).json({
      message: 'Progress retrieved successfully',
      data: theoryData
    })
  } catch (error) {
    console.error('Error finding Progress:', error.message)
    return res.status(500).json({ message: 'An error occurred while retrieving progress', error: error.message })
  }
}
// const findProgressByChapter = async (req, res, next) => {
//   try {
//     const loginedUserId = req.userId
//     const { chapterId, from, to } = req.query
//     console.log('chapterId:', chapterId)

//     if (!chapterId) {
//       return res.status(400).json({ message: 'Missing chapterId' })
//     }

//     const whereClause = {
//       userId: loginedUserId
//     }

//     if (from && to) {
//       whereClause.createdAt = {
//         [Op.between]: [new Date(from), new Date(to)]
//       }
//     }

//     const progressList = await models.Progress.findAll({
//       where: whereClause,
//       include: [
//         {
//           model: models.Theory,
//           required: true,
//           attributes: ['id'],
//           include: [
//             {
//               model: models.Lesson,
//               required: true,
//               include: [
//                 {
//                   model: models.Chapter,
//                   required: true,
//                   where: {
//                     id: chapterId
//                   }
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     })

//     const theoryIds = progressList.map(progress => progress.Theory.id)

//     return res.status(200).json({
//       message: 'Progress retrieved successfully',
//       data: theoryIds
//     })
//   } catch (error) {
//     console.error('Error finding Progress:', error.message)
//     return res.status(500).json({ message: 'An error occurred while retrieving progress', error: error.message })
//   }
// }
module.exports = {
  addProgress,
  findProgressByGradeAndSubject,
  findProgressByChapter
}

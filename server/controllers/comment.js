const { models } = require('../models')
const socket = require('../socket') // Import socket module

const getAllCommentsByTheoryId = async (req, res, next) => {
  try {
    const { theoryId } = req.params

    if (!theoryId) {
      return res.status(400).json({ message: 'Missing theoryId' })
    }

    const comments = await models.Comment.findAll({
      where: {
        theoryId
      },
      attributes: [
        'id',
        'content',
        'userId',
        'theoryId',
        'isView',
        'status',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: models.User,
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    })

    if (!comments || comments.length === 0) {
      return res.json({ message: 'No comments found', data: [] })
    }

    res.json({ data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({ message: 'Error fetching comments' })
  }
}
const getListActiveCommentByTheoryId = async (req, res, next) => {
  try {
    const { theoryId } = req.params
    if (!theoryId) {
      return res.status(400).json({ message: 'Missing theoryId' })
    }

    const comments = await models.Comment.findAll({
      where: {
        theoryId,
        isView: true
      },
      attributes: [
        'id',
        'content',
        'userId',
        'theoryId',
        'isView',
        'status',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: models.User,
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    if (!comments || comments.length === 0) {
      return res.json({ message: 'No comments found', data: [] })
    }

    res.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({ message: 'Error fetching comments' })
  }
}
const addComment = async (req, res, next) => {
  try {
    const loginedUserId = req.userId
    const { theoryId, content } = req.body

    if (!theoryId || !loginedUserId || !content) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const user = await models.User.findByPk(loginedUserId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const theory = await models.Theory.findByPk(theoryId)
    if (!theory) {
      return res.status(404).json({ message: 'Theory not found' })
    }

    const newComment = await models.Comment.create({
      theoryId,
      userId: loginedUserId,
      content,
      isView: true,
      status: true
    })
    const commentWithUser = await models.Comment.findByPk(newComment.id, {
      attributes: [
        'id',
        'content',
        'userId',
        'theoryId',
        'isView',
        'status',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: models.User,
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    })

    // Phát sự kiện qua Socket.IO
    const io = socket.getIO()
    io.emit('newComment', commentWithUser)

    res.status(201).json({ data: commentWithUser })
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({ message: 'Error adding comment' })
  }
}

module.exports = {
  getAllCommentsByTheoryId,
  getListActiveCommentByTheoryId,
  addComment
}

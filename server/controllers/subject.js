const { models } = require('../models')

const getAllSubject = async (req, res, next) => {
  try {
    const chapters = await models.Subject.findAll({
      attributes: [
        'id',
        'name',
        'status',
        'createdAt',
        'updatedAt'
      ]
    })

    if (!chapters || chapters.length === 0) {
      return res.status(404).json({ message: 'No chapters found' })
    }

    res.json(chapters)
  } catch (error) {
    console.error('Error fetching chapters:', error)
    res.status(500).json({ message: 'Error fetching chapters' })
  }
}

module.exports = {
  getAllSubject
}

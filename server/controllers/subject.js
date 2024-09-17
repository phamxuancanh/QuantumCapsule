const { models } = require('../models')

const getListSubject = async (req, res, next) => {
  try {
    const subjects = await models.Subject.findAll({
      attributes: [
        'id',
        'name',
        'image_on',
        'image_off',
        'status',
        'createdAt',
        'updatedAt'
      ]
    })

    if (!subjects || subjects.length === 0) {
      return res.json({ message: 'No subjects found', data: [] })
    }

    res.json({ data: subjects })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    res.status(500).json({ message: 'Error fetching subjects' })
  }
}

module.exports = {
  getListSubject
}

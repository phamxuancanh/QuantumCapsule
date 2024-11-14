const { models } = require('../models')
// get list subject
const getListSubject = async (req, res, next) => {
  try {
    const subjects = await models.Subject.findAll({
      where: {
        status: 1 // Chỉ lấy những subject có status là 1
      },
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
const getSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params
    const subject = await models.Subject.findByPk(id, {
      where: {
        status: 1 // Chỉ lấy những subject có status là 1
      },
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

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or inactive' })
    }

    res.json({ data: subject })
  } catch (error) {
    console.error('Error fetching subject:', error)
    res.status(500).json({ message: 'Error fetching subject' })
  }
}
module.exports = {
  getListSubject,
  getSubjectById
}

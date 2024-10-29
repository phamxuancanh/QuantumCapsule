const { models } = require('../models')
// get list pet
const getListPet = async (req, res, next) => {
  try {
    const pets = await models.Pet.findAll({
      attributes: [
        'id',
        'name',
        'imageUrl',
        'pointsRequired',
        'createdAt',
        'updatedAt'
      ]
    })

    if (!pets || pets.length === 0) {
      return res.json({ message: 'No pets found', data: [] })
    }

    res.json({ data: pets })
  } catch (error) {
    console.error('Error fetching pets:', error)
    res.status(500).json({ message: 'Error fetching pets' })
  }
}
const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params
    const pet = await models.Pet.findByPk(id, {
      attributes: [
        'id',
        'name',
        'imageUrl',
        'pointsRequired',
        'createdAt',
        'updatedAt'
      ]
    })

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' })
    }

    res.json({ data: pet })
  } catch (error) {
    console.error('Error fetching pet:', error)
    res.status(500).json({ message: 'Error fetching pet' })
  }
}
module.exports = {
  getListPet,
  getPetById
}

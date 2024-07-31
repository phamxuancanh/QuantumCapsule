const { models } = require('../models')
const bcrypt = require('bcrypt')

const editUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { firstName, lastName, email, gender, age, password, currentPassword } = req.body.data
    const userToEdit = await models.User.findByPk(id)
    console.log('------------------------------------------------------')
    console.log('check payload', req.body.data)
    console.log('check user to edit', userToEdit)

    if (!userToEdit) {
      return res.status(404).json({ message: 'MASSAGE.USER_NOT_FOUND' })
    }
    let updatedUser
    console.log('check password', password)
    console.log('check current password', currentPassword)
    console.log('check user to edit password', userToEdit.password)

    if (password) {
      const isPasswordValid = bcrypt.compareSync(currentPassword, userToEdit.password)
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'MASSAGE.NO_UPDATE', field: 'currentPassword' })
      }
      const hashPassword = bcrypt.hashSync(password, 10)
      updatedUser = await userToEdit.update({ firstName, lastName, email, gender, age, password: hashPassword })
    } else {
      updatedUser = await userToEdit.update({ firstName, lastName, email, gender, age })
    }

    return res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: 'MASSAGE.NO_UPDATE_USER' })
  }
}
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await models.User.findByPk(id, {
      attributes: ['avatar', 'email', 'firstName', 'id', 'lastName', 'username']
    })
    if (!user) {
      return res.status(404).json({ message: 'not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'not found' })
  }
}
module.exports = {
  getUserById,
  editUserById
}

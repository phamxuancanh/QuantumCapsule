const { models } = require('../models')
const CryptoJS = require('crypto-js')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
  region: process.env.REGION
})
const s3 = new AWS.S3()
const bucketName = process.env.S3_BUCKET_NAME

const changeAVT = async (req, res, next) => {
  try {
    const { id } = req.params
    const image = req.file ? req.file.originalname.split('.') : []
    const fileType = image[image.length - 1]
    const filePath = `AVT_${id}_${Date.now().toString()}.${fileType}`
    const user = await models.User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: 'not found' })
    } else {
      const paramsS3 = {
        Bucket: bucketName,
        Key: filePath,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      }
      s3.upload(paramsS3, async (err, data) => {
        if (err) {
          console.log('error1', err)
          return res.status(500).json({ message: 'not found' })
        }
        const updatedUser = await user.update({ avatar: data.Location })
        res.json(updatedUser)
      })
    }
  } catch (error) {
    console.log('error2', error)
    res.status(500).json({ message: 'not found' })
  }
}

const editUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { firstName, lastName, dob, phone, email, city, district, ward, petId } = req.body.data
    const userToEdit = await models.User.findByPk(id)
    console.log('------------------------------------------------------')
    console.log('check payload', req.body.data)
    console.log('check user to edit', userToEdit)

    if (!userToEdit) {
      return res.status(404).json({ message: 'MASSAGE.USER_NOT_FOUND' })
    }
    const updatedUser = await userToEdit.update({ firstName, lastName, dob, phone, email, city, district, ward, petId })

    return res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: 'MASSAGE.NO_UPDATE_USER' })
  }
}
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await models.User.findByPk(id, {
      attributes: [
        'avatar',
        'email',
        'firstName',
        'id',
        'lastName',
        'roleId',
        'grade',
        'phone',
        'city',
        'district',
        'ward',
        'birthOfDate',
        'starPoint',
        'petId'
      ]
    })

    if (!user) {
      return res.status(404).json({ message: 'not found' })
    }

    const role = await models.Role.findOne({
      where: { id: user.roleId }
    })
    const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
    const userResult = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      key: encryptedRole,
      grade: user.grade,
      phone: user.phone,
      city: user.city,
      district: user.district,
      ward: user.ward,
      starPoint: user.starPoint,
      petId: user.petId,
      dob: user.birthOfDate ? user.birthOfDate.toISOString().split('T')[0] : ''
    }

    res.json(userResult)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'not found' })
  }
}
const assignClassToUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { grade } = req.body
    console.log('check grade', grade)
    console.log('check id', id)
    if (isNaN(grade)) {
      return res.status(400).json({ message: 'Grade must be a number' })
    }
    const user = await models.User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const updatedUser = await user.update({ grade })
    res.json(updatedUser)
  } catch (error) {
    console.log('Error assigning class to user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
module.exports = {
  changeAVT,
  getUserById,
  editUserById,
  assignClassToUser
}

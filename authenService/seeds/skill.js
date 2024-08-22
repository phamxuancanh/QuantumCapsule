const { fakerEN: faker } = require('@faker-js/faker')
const Course = require('../models/course')
const CategoryLession = require('../models/category_lession')

const sampleNames = [
  'Các số từ 0 đến 10', 'So sánh vị trí, nhiều ít, lớn bé', 'Hình học', 'Phép cộng trong phạm vi đến 10', 'Ôn tập chủ để "Hình học, đo lường"', 'Phép trừ trong phạm vi đến 10',
  'Ôn tập các số đến 10', 'Bài kiểm tra', 'Thi giữa kì 1', 'Thi cuối học kì'
]

const generateCategoryLession = async () => {
  const categoryLessions = []
  const courses = await Course.findAll()

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]
    const courseId = course.id
    let sampleNamesCopy = [...sampleNames]
    const numLessons = Math.floor(Math.random() * 4) + 3
    let order = 1
    const checkUpDate = new Date()
    for (let j = 0; j < numLessons; j++) {
      const randomIndex = Math.floor(Math.random() * sampleNamesCopy.length)
      const categoryLessonName = sampleNamesCopy[randomIndex]
      sampleNamesCopy = sampleNamesCopy.filter((_, index) => index !== randomIndex)

      categoryLessions.push({
        courseId,
        name: categoryLessonName,
        order,
        checkUpDate,
        createAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })
      order += 1
      if (sampleNamesCopy.length === 0) {
        sampleNamesCopy = [...sampleNames]
      }
    }
  }
  return categoryLessions
}

const seedCategoryLession = async () => {
  try {
    const count = await CategoryLession.count()
    if (count === 0) {
      const categorylessions = await generateCategoryLession()
      await CategoryLession.bulkCreate(categorylessions, { validate: true })
    } else {
      console.log('CategoryLession table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed CategoryLession data: ${error}`)
  }
}

module.exports = seedCategoryLession
const { fakerEN: faker } = require('@faker-js/faker')
const Subject = require('../models/subject')
const Skill = require('../models/chapter')

const sampleNames = [
  'Frontend', 'Backend', 'NodeJS', 'Docker', 'Golang', 'Python',
  'UX/UI Design', 'Digital Marketing', 'Project Management', 'Testing',
  'Data Science', 'Machine Learning', 'Cybersecurity', 'Cloud Computing',
  'Mobile Development', 'Artificial Intelligence', 'Blockchain',
  'Big Data', 'Web Development', 'iOS Development', 'Android Development',
  'Network Security', 'Game Development', 'DevOps', 'UI/UX Design',
  'Software Engineering', 'Internet of Things', 'Agile Development',
  'Database Management', 'Computer Vision', 'Natural Language Processing',
  'UI Design Fundamentals', 'Web Security', 'Server Administration',
  'Network Engineering', 'Embedded Systems', 'Software Testing',
  'Content Management Systems', 'IoT Protocols', 'Cloud Security',
  'eCommerce Platforms', 'Data Analysis', 'Algorithm Design',
  'Project Planning', 'API Development', 'Machine Learning Algorithms',
  'Mobile App Design'
]

const generateSkill = async () => {
  const skills = []
  const subjects = await Subject.findAll()

  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i]
    const subjectId = subject.id
    let sampleNamesCopy = [...sampleNames]
    let totalSkillsForSubject = 0
    const gradeCount = Array(12).fill(0)

    for (let grade = 1; grade <= 12; grade++) {
      for (let j = 0; j < 10; j++) {
        const randomIndex = Math.floor(Math.random() * sampleNamesCopy.length)
        const categoryLessonName = sampleNamesCopy[randomIndex]
        sampleNamesCopy = sampleNamesCopy.filter((_, index) => index !== randomIndex)

        skills.push({
          subjectId,
          name: categoryLessonName,
          desciption: faker.lorem.sentence(),
          grade,
          order: totalSkillsForSubject + 1,
          createAt: faker.date.past(),
          updatedAt: faker.date.recent()
        })
        gradeCount[grade - 1] += 1
        totalSkillsForSubject += 1

        if (sampleNamesCopy.length === 0) {
          sampleNamesCopy = [...sampleNames]
        }
      }
    }

    while (totalSkillsForSubject < 100) {
      const randomIndex = Math.floor(Math.random() * sampleNamesCopy.length)
      const categoryLessonName = sampleNamesCopy[randomIndex]
      sampleNamesCopy = sampleNamesCopy.filter((_, index) => index !== randomIndex)

      const grade = Math.floor(Math.random() * 12) + 1

      skills.push({
        subjectId,
        name: categoryLessonName,
        desciption: faker.lorem.sentence(),
        grade,
        order: totalSkillsForSubject + 1,
        createAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })
      gradeCount[grade - 1] += 1
      totalSkillsForSubject += 1
      if (sampleNamesCopy.length === 0) {
        sampleNamesCopy = [...sampleNames]
      }
    }
  }
  return skills
}

const seedSkill = async () => {
  try {
    const count = await Skill.count()
    if (count === 0) {
      const skills = await generateSkill()
      await Skill.bulkCreate(skills, { validate: true })
    } else {
      console.log('Skill table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Skill data: ${error}`)
  }
}

module.exports = seedSkill

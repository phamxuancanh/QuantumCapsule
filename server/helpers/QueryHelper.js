const queries = {
  getStarPointOfUser: `SELECT SUM(max_star) as starPoint
    FROM (
        SELECT MAX(r.star) AS max_star
        FROM results r
        where userId = :userId
        GROUP BY r.userId, r.examId
    ) AS subquery `,
  getListResultAndExamNameByUserId: `SELECT r.*, e.name AS examName, c.name as chapterName, l.name as lessonName
    FROM results r
    JOIN exams e ON r.examId = e.id
    left join chapters c on e.chapterId = c.id
    left join lessons l on e.lessonId = l.id
    WHERE r.userId = :userId
    and r.timeStart between :from and :to
    order by r.timeStart desc;`,
  getListQuestionByExamId: `
    select q.*, eq.id as examQuestionId
    from questions q
    join exam_questions eq on q.id = eq.questionId
    where examId = :examId and eq.status = 1 and q.status = 1
  `,
  // bỏ
  getListExamQuestionByChapterId: `
    select eq.* from exam_questions eq
    join exams e on eq.examId = e.id
    join lessons l on e.lessonId = l.id
    where l.chapterId = :chapterId and eq.status = 1
    order by eq.updatedAt desc
  `,
  getListExamQuestionByExamId: `
    select eq.* from exam_questions eq
    where eq.examId = :examId and eq.status = 1
    order by eq.updatedAt desc
  `,
  getExamInfo: `
    select s.name as subjectName, c.grade as grade, c.name as chapterName, l.name as lessonName, e.name as examName 
    from exams e
    left join lessons l on e.lessonId = l.id
    left join chapters c on l.chapterId = c.id
    left join subjects s on c.subjectId = s.id
    where e.id = :examId
  `,
  getExamInfoForExam: `
    select s.name as subjectName, c.grade as grade, c.name as chapterName, e.name as examName 
    from exams e
    left join chapters c on e.chapterId = c.id
    left join subjects s on c.subjectId = s.id
    where e.id = :examId
  `,
  getListQuestionByChapterId: `
    select q.* from questions q
    where q.status = 1 and q.chapterId = :chapterId
    order by q.updatedAt desc
  `,
  getListQuestionByLessonId: `
    select q.* from questions q
    where q.status = 1 and q.lessonId = :lessonId
    order by q.updatedAt desc
  `,
  getListExamByChapterId: `
    select e.* from exams e
    where  e.chapterId = :chapterId and e.status = 1
    order by e.updatedAt desc
  `,
  getListExamByLessonId: `
    select e.* from exams e
    where  e.lessonId = :lessonId and e.status = 1
    order by e.updatedAt desc
  `,
  getListLessonByChapterId: `
    select l.* from lessons l
    where l.chapterId = :chapterId and l.status = 1
    order by l.updatedAt desc
  `,
  getListTheoryByChapterId: `
    select t.* from theories t
    join lessons l on t.lessonId = l.id
    where l.chapterId = :chapterId and t.status = 1
    order by t.updatedAt desc
  `
}
module.exports = { queries }

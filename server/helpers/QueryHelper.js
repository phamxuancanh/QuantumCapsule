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
    where examId = :examId
  `
}
module.exports = { queries }

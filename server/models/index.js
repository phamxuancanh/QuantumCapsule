const sequelize = require('./init')
const User = require('./user')
const Role = require('./role')
const Grid = require('./grid')
const Subject = require('./subject')
const Keyword = require('./keyword')
const Chapter = require('./chapter')
const TheoryKeyword = require('./theory_keyword')
const Lesson = require('./lesson')
const Theory = require('./theory')
const Exam = require('./exam')
const Question = require('./question')
const Answer = require('./answer')
const Result = require('./result')
const Comment = require('./comment')
const Notification = require('./notification')
const NotificationRecipient = require('./notification_recipient')
const Conversation = require('./conversation')
const UserConversations = require('./user_conversation')
const Message = require('./message')
const ExamQuestion = require('./exam_question')
const Progress = require('./progress')
const Enrollment = require('./enrollment')
Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

Subject.hasMany(Chapter, { foreignKey: 'subjectId' })
Chapter.belongsTo(Subject, { foreignKey: 'subjectId' })

Chapter.hasMany(Lesson, { foreignKey: 'chapterId' })
Lesson.belongsTo(Chapter, { foreignKey: 'chapterId' })

TheoryKeyword.belongsTo(Theory, { foreignKey: 'theoryId' })
TheoryKeyword.belongsTo(Keyword, { foreignKey: 'keywordId' })

Theory.belongsToMany(Keyword, { through: TheoryKeyword, foreignKey: 'theoryId' })
Keyword.belongsToMany(Theory, { through: TheoryKeyword, foreignKey: 'keywordId' })

ExamQuestion.belongsTo(Exam, { foreignKey: 'examId' })
ExamQuestion.belongsTo(Question, { foreignKey: 'questionId' })

Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: 'examId' })
Question.belongsToMany(Exam, { through: ExamQuestion, foreignKey: 'questionId' })

Chapter.hasMany(Exam, { foreignKey: 'chapterId' })
Exam.belongsTo(Chapter, { foreignKey: 'chapterId' })

Lesson.hasMany(Exam, { foreignKey: 'lessonId' })
Exam.belongsTo(Lesson, { foreignKey: 'lessonId' })

Lesson.hasMany(Theory, { foreignKey: 'lessonId' })
Theory.belongsTo(Lesson, { foreignKey: 'lessonId' })

Question.hasMany(Answer, { foreignKey: 'questionId' })
Answer.belongsTo(Question, { foreignKey: 'questionId' })

Result.hasMany(Answer, { foreignKey: 'resultId' })
Answer.belongsTo(Result, { foreignKey: 'resultId' })

User.hasMany(Result, { foreignKey: 'userId' })
Result.belongsTo(User, { foreignKey: 'userId' })

Comment.belongsTo(Theory, { foreignKey: 'theoryId' })
Comment.belongsTo(User, { foreignKey: 'userId' })

Theory.hasMany(Comment, { foreignKey: 'theoryId' })
User.hasMany(Comment, { foreignKey: 'userId' })

Progress.belongsTo(User, { foreignKey: 'userId' })
Progress.belongsTo(Theory, { foreignKey: 'theoryId' })

User.belongsToMany(Theory, { through: Progress, foreignKey: 'userId' })
Theory.belongsToMany(User, { through: Progress, foreignKey: 'theoryId' })

Enrollment.belongsTo(User, { foreignKey: 'userId' })
Enrollment.belongsTo(Lesson, { foreignKey: 'lessonId' })

User.belongsToMany(Lesson, { through: Enrollment, foreignKey: 'userId' })
Lesson.belongsToMany(User, { through: Enrollment, foreignKey: 'lessonId' })

NotificationRecipient.belongsTo(User, { foreignKey: 'userId' })
NotificationRecipient.belongsTo(Notification, { foreignKey: 'notificationId' })

User.belongsToMany(Notification, { through: NotificationRecipient, foreignKey: 'userId' })
Notification.belongsToMany(User, { through: NotificationRecipient, foreignKey: 'notificationId' })

UserConversations.belongsTo(User, { foreignKey: 'userId' })
UserConversations.belongsTo(Conversation, { foreignKey: 'conversationId' })

User.belongsToMany(Conversation, { through: UserConversations, foreignKey: 'userId' })
Conversation.belongsToMany(User, { through: UserConversations, foreignKey: 'conversationId' })

Message.belongsTo(User, { foreignKey: 'userId' })
Message.belongsTo(Conversation, { foreignKey: 'conversationId' })

User.belongsToMany(Conversation, { through: Message, foreignKey: 'userId' })
Conversation.belongsToMany(User, { through: Message, foreignKey: 'conversationId' })

module.exports = {
  sequelize,
  models: {
    User,
    Role,
    Grid,
    Subject,
    Chapter,
    Theory,
    Keyword,
    TheoryKeyword,
    Lesson,
    Progress,
    Enrollment,
    Exam,
    Question,
    ExamQuestion,
    Answer,
    Result,
    Notification,
    NotificationRecipient,
    Comment,
    Conversation,
    UserConversations,
    Message
  }
}

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
const Scoresheet = require('./scoresheet')
const Comment = require('./comment')
const Notification = require('./notification')
const NotificationRecipient = require('./notification_recipient')
const Conversation = require('./conversation')
const UserConversations = require('./user_conversation')
const Message = require('./message')
const ExamQuestion = require('./exam_question')

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
Theory.belongsTo(Chapter, { foreignKey: 'lessonId' })

Question.hasMany(Answer, { foreignKey: 'questionId' })
Answer.belongsTo(Question, { foreignKey: 'questionId' })

Scoresheet.hasMany(Answer, { foreignKey: 'scoresheetId' })
Answer.belongsTo(Scoresheet, { foreignKey: 'scoresheetId' })

User.hasMany(Scoresheet, { foreignKey: 'userId' })
Scoresheet.belongsTo(User, { foreignKey: 'userId' })

Comment.belongsTo(Theory, { foreignKey: 'theoryId' })
Comment.belongsTo(User, { foreignKey: 'userId' })

Theory.hasMany(Comment, { foreignKey: 'theoryId' })
User.hasMany(Comment, { foreignKey: 'userId' })

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
    Exam,
    Question,
    ExamQuestion,
    Answer,
    Scoresheet,
    Notification,
    NotificationRecipient,
    Comment,
    Conversation,
    UserConversations,
    Message
  }
}

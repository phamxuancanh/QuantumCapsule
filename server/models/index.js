const sequelize = require('./init')
const User = require('./user')
const Role = require('./role')
const Grid = require('./grid')
const Subject = require('./subject')
const Keyword = require('./keyword')
const Chapter = require('./chapter')
const ChapterKeyword = require('./chapter_keyword')
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

Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

Subject.hasMany(Chapter, { foreignKey: 'subjectId' })
Chapter.belongsTo(Subject, { foreignKey: 'subjectId' })

Chapter.hasMany(Lesson, { foreignKey: 'chapterId' })
Lesson.belongsTo(Chapter, { foreignKey: 'chapterId' })

ChapterKeyword.belongsTo(Chapter, { foreignKey: 'chapterId' })
ChapterKeyword.belongsTo(Keyword, { foreignKey: 'keywordId' })

Chapter.belongsToMany(Keyword, { through: ChapterKeyword, foreignKey: 'chapterId' })
Keyword.belongsToMany(Chapter, { through: ChapterKeyword, foreignKey: 'keywordId' })

Chapter.hasMany(Exam, { foreignKey: 'chapterId' })
Exam.belongsTo(Chapter, { foreignKey: 'chapterId' })

Lesson.hasMany(Theory, { foreignKey: 'lessonId' })
Theory.belongsTo(Chapter, { foreignKey: 'lessonId' })

Lesson.hasMany(Exam, { foreignKey: 'lessonId' })
Exam.belongsTo(Chapter, { foreignKey: 'lessonId' })

Exam.hasMany(Question, { foreignKey: 'examId' })
Question.belongsTo(Exam, { foreignKey: 'examId' })

Question.hasMany(Answer, { foreignKey: 'questionId' })
Answer.belongsTo(Question, { foreignKey: 'questionId' })

Answer.hasMany(Result, { foreignKey: 'answerId' })
Result.belongsTo(Answer, { foreignKey: 'answerId' })

Comment.belongsTo(Theory, { foreignKey: 'theoryId' })
Comment.belongsTo(User, { foreignKey: 'userId' })

Theory.belongsToMany(User, { through: Comment, foreignKey: 'theoryId' })
User.belongsToMany(Theory, { through: Comment, foreignKey: 'userId' })

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
    Keyword,
    ChapterKeyword,
    Lesson,
    Theory,
    Exam,
    Question,
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

const sequelize = require('./init')
const User = require('./user')
const Permission = require('./permission')
const Role = require('./role')
const RoleToPermission = require('./role_to_permission')
const Route = require('./route')
const Grid = require('./grid')
const Subject = require('./subject')
const Skill = require('./chapter')
const Topic = require('./topic')
const Comment = require('./comment')
const Notification = require('./notification')
const NotificationRecipient = require('./notification_recipient')
const Conversation = require('./conversation')
const UserConversations = require('./user_conversation')
const Message = require('./message')
const Exam = require('./exam')
const Practice = require('./practice')
const Question = require('./question')
const Answer = require('./answer')
const Result = require('./result')

Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

RoleToPermission.belongsTo(Role, { foreignKey: 'roleId' })
RoleToPermission.belongsTo(Permission, { foreignKey: 'permissionId' })

Role.belongsToMany(Permission, { through: RoleToPermission, foreignKey: 'roleId' })
Permission.belongsToMany(Role, { through: RoleToPermission, foreignKey: 'permissionId' })

Subject.hasMany(Skill, { foreignKey: 'subjectId' })
Skill.belongsTo(Subject, { foreignKey: 'subjectId' })

Skill.hasMany(Topic, { foreignKey: 'skillId' })
Topic.belongsTo(Skill, { foreignKey: 'skillId' })

Comment.belongsTo(Topic, { foreignKey: 'topicId' })
Comment.belongsTo(User, { foreignKey: 'userId' })

Topic.belongsToMany(User, { through: Comment, foreignKey: 'topicId' })
User.belongsToMany(Topic, { through: Comment, foreignKey: 'userId' })

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

Exam.hasMany(Question, { foreignKey: 'examId' })
Question.belongsTo(Exam, { foreignKey: 'questionId' })

Practice.hasMany(Question, { foreignKey: 'practiceId' })
Question.belongsTo(Practice, { foreignKey: 'questionId' })

Question.hasMany(Answer, { foreignKey: 'questionId' })
Answer.belongsTo(Question, { foreignKey: 'answerId' })

Answer.hasMany(Result, { foreignKey: 'answerId' })
Result.belongsTo(Answer, { foreignKey: 'resultId' })

module.exports = {
  sequelize,
  models: {
    User,
    Permission,
    Role,
    RoleToPermission,
    Route,
    Grid,
    Subject,
    Skill,
    Topic,
    Comment,
    Notification,
    NotificationRecipient,
    Message,
    Exam,
    Practice,
    Question,
    Answer,
    Result
  }
}

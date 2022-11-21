import Sequelize from 'sequelize';
import config from '../config/config.js';
import User from './user.js';
import Post from './post.js';
import Story from './story.js';
import Comment from './comment.js';

const env = process.env.NODE_ENV || 'development';
config[env];

const db = {};
const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Story = Story;
db.Comment = Comment;

User.init(sequelize);
Post.init(sequelize);
Story.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Post.associate(db);
Story.associate(db);
Comment.associate(db);

export { db, sequelize };

import Sequelize from 'sequelize';
import config from '../config/config.json';
import User from './user';
import Post from './post';
import Story from './story';
import Comment from './comment';

const env = process.env.NODE_ENV || 'development';
config[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
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

export default db;

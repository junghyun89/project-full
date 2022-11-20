import Sequelize from 'sequelize';

export default class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        desc: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { onDelete: 'CASCADE' });
    db.Post.hasMany(db.Comment, { onDelete: 'CASCADE' });
    db.Post.belongsToMany(db.User, { through: 'likes', onDelete: 'CASCADE' });
  }
}

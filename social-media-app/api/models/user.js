import Sequelize from 'sequelize';

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(45),
          allowNull: false,
          unique: true,
        },
        username: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        coverPic: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        profilePic: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        city: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },
        website: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Comment, { onDelete: 'CASCADE' });
    db.User.hasMany(db.Story, { onDelete: 'CASCADE' });
    db.User.hasMany(db.Post, { onDelete: 'CASCADE' });
    db.User.belongsToMany(db.Post, {
      through: 'likes',
      as: 'liked',
      onDelete: 'CASCADE',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerUserId',
      as: 'Followers',
      through: 'relationships',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followedUserId',
      as: 'Followeds',
      through: 'relationships',
    });
  }
}

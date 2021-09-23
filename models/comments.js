'use strict';

module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define(
    "comments", {
      idcom: DataTypes.INTEGER,
      publicationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      username: DataTypes.STRING,
      content: DataTypes.STRING,
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE
    }, {}

  );
  comments.associate = function (models) {
    comments.belongsTo(models.User, {
      foreignKey: "userId",
    }); //plusieurs messages peuvent-être lié à un user
    comments.belongsTo(models.Publication, {
      //plusieurs commentaires peuvent-être lié à un user
      foreignKey: "publicationId",
      onDelete: "CASCADE",
    });
  };

  return comments;
};
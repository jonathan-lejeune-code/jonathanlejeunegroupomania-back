'use strict';

module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define(
    "comments", {

      publicationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      username: DataTypes.STRING,
      comments: DataTypes.STRING,

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
const models = require("../models");

// On utilise le token pour identifier la personne qui publie le commentaire
const jwt = require('jsonwebtoken');



exports.getAllComment = (req, res) => {

    models.Comment.findAll({
            attributes: [
                "id",
                "content",
                "userId",
                "postId",
                "createdAt",
                "updatedAt"
            ],

            order: sequelize.literal('id DESC'),
            where: {
                postId: req.params.id
            },
            include: [{
                    model: models.User,
                    attributes: ['username']
                },

            ],
        })

        .then(comments => res.status(200).json(comments))
        .catch(error => res.status(400).json({
            error: "une erreur sur le commentaire",
            error: error
        }));
};
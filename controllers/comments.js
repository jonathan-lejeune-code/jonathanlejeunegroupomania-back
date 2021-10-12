const models = require("../models");


// On utilise le token pour identifier la personne qui publie le commentaire
const jwt = require('jsonwebtoken');





exports.getAllComment = (req, res) => {

    models.comments.findAll({
            attributes: [
                "id",
                "userId",
                "postId",
                "comment",
                "createdAt",
                "updatedAt"
            ],

            order: sequelize.literal('id DESC'),
            where: {
                postId: req.params.id
            },
            include: [{
                    model: models.user,
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

exports.deleteComment = async (req, res) => {
    try {
        await models.Comments.destroy({
            where: {
                id: (req.params.id)
            }
        });
        return res.status(200).send({
            message: "Comment supprimée"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            err
        });
    }
};
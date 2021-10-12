const models = require("../models");


// On utilise le token pour identifier la personne qui publie le commentaire
const jwt = require('jsonwebtoken');


//Création d'un commentaire
exports.createComment = async (req, res) => {
    try {
        let comments = req.body.comment;

        const newCom = await models.comments.create({
            comment: comments,
            userId: req.user.id,
            postId: req.params.id
        });

        if (newCom) {
            res.status(201).json({
                message: "commentaire envoyé",
                newCom
            });
        } else {
            throw new Error("Désolé, il y a un soucis");
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }

};

//test ok 
exports.deleteComment = async (req, res) => {
    try {
        await models.comments.destroy({
            where: {
                id: (req.params.id)
            }
        });
        return res.status(200).send({
            message: "Commentaire supprimée"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            err
        });
    }
};


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
                id: req.params.id
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
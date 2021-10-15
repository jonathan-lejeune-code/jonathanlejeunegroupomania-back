const models = require("../models");
// On utilise le token pour identifier la personne qui publie le commentaire
const jwt = require('jsonwebtoken');


//Création d'un commentaire
exports.createComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.KEY_TOKEN);
    const userId = decodedToken.userId;

    if (req.body.comments === "") {
        return res
            .status(400)
            .json({
                error: "Merci de remplir le champ commentaire."
            });
    }

    models.comments.create({
            userId: userId,
            postId: req.params.id,
            comments: req.body.comments,
        })
        .then(() => res.status(200).json({
            message: "Commentaire enregistré !"
        }))
        .catch((error) => res.status(500).json(error));
};


//test ok 

exports.getAllComment = (req, res) => {

    models.comments.findAll({
            attributes: [
                "id",
                "userId",
                "postId",
                "comments",
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

//test ok 
exports.deleteComment = async (req, res, next) => {
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
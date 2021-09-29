'use strict';

const models = require('../models/index.js');

// Inclusion des services
const userManager = require('../services/user/userManager');
const publicationManager = require('../services/publication/publicationManager');

// On utilise le token pour identifier la personne qui publie le commentaire
const jwt = require('jsonwebtoken');

exports.createPublication = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.KEY_TOKEN);
    const userId = decodedToken.userId;

    // Recherche de l'utilisateur courant
    return userManager
        .findOne({
            'id': userId
        })
        .then(user => {
            // On vérifie le retour de la requête sql
            if (null == user) {
                return res.status(400).json({
                    'error': 'Utilisateur non trouvé.',
                    'userId': userId
                })
            }

            let data = {
                'UserId': userId,
                'title': req.body.title,
                'content': req.body.content,
                'likes': req.body.likes,
                'attachment': `${req.body.inputFile}`

            };

            // Création d'une publication
            return publicationManager
                .create(data)
                .then((newPost) => {
                    return res.status(200).json({
                        'user': user,
                        'newPost': newPost
                    })
                })
                .catch((error) => {
                    return res.status(400).json({
                        'error': error,
                        'user': user,
                        'data': data
                    })
                });
        })
        .catch(error => {
            return res.status(500).json({
                'error': error,
                'userId': userId
            })
        });
}

exports.getAllPublication = (req, res, next) => {

    models.Publication.findAll({

            order: sequelize.literal('id DESC'),
            include: [{
                    model: models.User,
                    attributes: ['username']
                },

            ],
        })

        .then(publications => res.status(200).json(publications))
        .catch(error => res.status(400).json({
            error: "gettallpublication",
            error: error
        }));
};

exports.getOnePublication = (req, res, next) => {

    models.Publication.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: models.User,
                attributes: ['username']
            }
        })
        .then(publication => {
            res.status(200).json(publication);
        })
        .catch(error => res.status(400).json({
            error
        }));
};

exports.modifyPublication = async (req, res) => {

    try {


        await models.Publication.findOne({
            where: {
                id: (req.params.id)
            }
        });

        await models.Publication.update({
            title: req.body.title,
            content: req.body.content,
            attachment: req.body.attachment

        }, {
            where: {
                id: (req.params.id)
            }
        });

        return res.status(200).send({
            message: "Publication modifiée"
        })
    } catch (err) {
        return res.status(500).json(err);
    }
};


exports.deletePublication = async (req, res, next) => {
    try {
        await models.Publication.destroy({
            where: {
                id: (req.params.id)
            }
        });
        return res.status(200).send({
            message: "Publication supprimée"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            err
        });
    }
};

//Création d'un commentaire
exports.createComment = async (req, res) => {
    try {
        let comments = req.body.comments;

        const newCom = await models.comment.create({
            comments: comments,
            userId: req.user.id,
            publicationId: req.params.id
        });

        if (newCom) {
            res.status(201).json({
                message: "Votre commentaire a été envoyé",
                newCom
            });
        } else {
            throw new Error("Une erreur est survenue. S'il vous plaît, veuillez réeessayer plus tard");
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }

};

//Récupération des commentaires
exports.getComments = async (req, res) => {
    try {
        const order = req.query.order;
        const comments = await models.comment.findAll({
            attributes: [
                "id",
                "comments",
                "userId",
                "publicationId",
                "createdAt",
                "updatedAt"
            ],
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            where: {
                publicationId: req.params.id
            },
            include: [{
                model: models.user,
                attributes: ["username"]
            }]
        });
        if (comments) {
            res.status(200).send({
                message: comments
            });
        } else {
            throw new Error("Il n'y a pas de commentaire");
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};
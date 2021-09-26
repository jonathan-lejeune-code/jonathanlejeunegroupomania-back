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
}


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
}

exports.createComment = (req, res, next) => {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    console.log(req.body)
    models.comments.create({
            publicationId: req.body.publicationId,
            userId: userId,
            username: req.body.username,
            content: req.body.content,
        })
        .then(
            (
                comments // console.log(comment))
            ) => res.status(201).json({
                comments
            })
        )
        .catch((error) => console.log(error));
    //  res.status(500).json(error))
};

exports.deleteComment = (req, res, next) => { //suppresion commentaire
    //identification du demandeur
    let userOrder = req.body.userIdOrder;
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    console.log(userId);
    models.User.findOne({
            attributes: ["id", "email", "username", "isAdmin"],
            where: {
                id: userId
            },
        })
        .then((user) => {
            //Vérification que le demandeur est soit l'admin soit le poster
            if (user && (user.isAdmin == true || user.id == userOrder)) {
                //userOrder et l'id de la personne qui créé le commentaire (envouyer par le front)
                console.log("Suppression commentaire avec l'id :", req.params.id); //récupère l'id en provenance de l'url
                models.comments.findOne({
                        where: {
                            id: req.params.id
                        },
                    })
                    .then((postFind) => {

                        models.comments.destroy({
                                where: {
                                    id: postFind.id
                                },
                            })
                            .then(() => res.end())
                            .catch((err) => res.status(500).json(err));

                    })
                    .catch((err) => res.status(500).json(err));
            } else {
                res.status(403).json("Utilisateur non autorisé à supprimer ce commentaire");
            }
        })
        .catch((error) => res.status(500).json(error));
};
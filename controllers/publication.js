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

            order: sequelize.literal('updatedAt DESC'),
            include: {
                model: models.User,
                attributes: ['username']
            }
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

exports.postLikes = (req, res, next) => {
    let token_user = req.body.token_user;
    let post_id = req.params.id;
    let ifExists = " \
        SELECT IF (EXISTS (SELECT * FROM likes WHERE token_user = '" + token_user + "' AND post_id = '" + post_id + "'), '1', '0') \
        UNION ALL \
        SELECT IF (EXISTS (SELECT * FROM dislikes WHERE token_user = '" + token_user + "' AND post_id = '" + post_id + "'), '1', '0')";
    sql.query(ifExists, function (err, result) {
        var valueOne = parseInt(Object.values(result[0]))
        var valueTwo = parseInt(Object.values(result[1]))
        switch (valueOne) {
            case 0:
                let addLike = " \
                    INSERT INTO likes (token_user, post_id) VALUES ('" + token_user + "', '" + post_id + "'); \
                    UPDATE Posts SET likes_number = likes_number +1 WHERE id = '" + post_id + "' \
                ";
                sql.query(addLike, function (err, result) {
                    if (result) {
                        switch (valueTwo) {
                            case 0:
                                return res.status(200).json({
                                    message: "Le post a bien été liké !"
                                })
                                break
                            case 1:
                                let addLikeAndRemoveDislike = " \
                                    DELETE FROM dislikes WHERE token_user = '" + token_user + "' AND post_id = '" + post_id + "';\
                                    UPDATE Posts SET dislikes_number = dislikes_number -1 WHERE id = '" + post_id + "' \
                                ";
                                sql.query(addLikeAndRemoveDislike, function (err, result) {
                                    if (result) {
                                        return res.status(200).json({
                                            message: "Le dislike du post a bien été supprimé !"
                                        })
                                    } else {
                                        return res.status(403).json({
                                            message: "Une erreur est survenue !"
                                        })
                                    }
                                })
                                break
                            default:
                                return res.status(404).json({
                                    message: "Une erreur est survenue dans le cas 0 du switch !"
                                })
                        }
                    } else {
                        return res.status(403).json({
                            message: "Une erreur est survenue !"
                        })
                    }
                })
                break;
            case 1:
                let removeLike = " \
                    DELETE FROM likes WHERE token_user = '" + token_user + "' AND post_id = '" + post_id + "'; \
                    UPDATE Posts SET likes_number = likes_number -1 WHERE id = '" + post_id + "' \
                ";
                sql.query(removeLike, function (err, result) {
                    if (result) {
                        return res.status(200).json({
                            message: "Le like a était retirer du post !"
                        })
                    } else {
                        return res.status(403).json({
                            message: "Une erreur est survenue !"
                        })
                    }
                })
                break;
            default:
                return res.status(404).json({
                    message: "Une erreur est survenue !"
                })
        }
    })
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
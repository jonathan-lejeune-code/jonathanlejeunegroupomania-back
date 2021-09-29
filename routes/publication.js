const express = require('express');
const router = express.Router();
const publicationCtrl = require('../controllers/publication');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// ROUTES //

// POST //
router.post('/', auth, multer, publicationCtrl.createPublication);

// GET //
router.get('/', auth, publicationCtrl.getAllPublication);

// GET ONE //
router.get('/:id', auth, publicationCtrl.getOnePublication);

// PUT //
router.put('/:id', auth, multer, publicationCtrl.modifyPublication);

// DELETE //
router.delete('/:id', auth, publicationCtrl.deletePublication);

// POST COMMENTS //
router.post('/comments', auth, multer, publicationCtrl.createComment);

// GET COMMENTS  //
router.get("/:id/comments", auth, publicationCtrl.getComments); //Récupérer des commentaires


// // DELETE COMMENTS //
// router.delete("/comments/:id", auth, publicationCtrl.deleteComment);


// EXPORT //

module.exports = router;
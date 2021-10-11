const express = require('express');
const router = express.Router();
const commentsctrl = require('../controllers/comments');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// ROUTES //

// POST //
router.post('/', auth, multer, commentsctrl.createComment);

// GET //
router.get('/', auth, commentsctrl.getAllComment);

// DELETE //
router.delete('/:id', auth, commentsctrl.deleteComment);





// EXPORT //

module.exports = router;
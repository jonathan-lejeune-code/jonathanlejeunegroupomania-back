const express = require('express');
const router = express.Router();
const commentsctrl = require('../controllers/comments');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// ROUTES //

// POST //
router.post("/:id/comment", auth, multer, commentsctrl.createComment);

// GET //
router.get("/:id/comments", auth, commentsctrl.getAllComment);

// DELETE //
router.delete("/:id/comments/:id", auth, commentsctrl.deleteComment);





// EXPORT //

module.exports = router;
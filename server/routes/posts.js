const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  likeComment,
  checkLiked
} = require('../controllers/post');

router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

router.post('/:id/comments', protect, addComment);
router.post('/:postId/comments/:commentId/like', protect, likeComment);
router.get('/:postId/comments/:commentId/liked', protect, checkLiked);

module.exports = router;
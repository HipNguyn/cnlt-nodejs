const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/blogposts/new', postController.getCreateForm);
router.post('/blogposts/store', postController.createPost);
router.get('/blogposts/:id', postController.getPostDetail);
router.get('/blogposts/edit/:id', postController.getEditForm);
router.post('/blogposts/update/:id', postController.updatePost);
router.post('/blogposts/delete/:id', postController.deletePost);

module.exports = router;

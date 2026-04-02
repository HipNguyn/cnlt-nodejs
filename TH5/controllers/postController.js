const BlogPost = require('../models/BlogPost');


exports.getAllPosts = async (req, res) => {
    
    const posts = await BlogPost.find({}).sort({ updatedAt: -1 });
    res.render('index', { posts });
};


exports.getCreateForm = (req, res) => {
    res.render('create');
};


exports.createPost = async (req, res) => {
    await BlogPost.create({
        title: req.body.title,
        body: req.body.body
    });
    res.redirect('/');
};


exports.getPostDetail = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('detail', { post });
};


exports.getEditForm = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('edit', { post });
};


exports.updatePost = async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body
    });
    res.redirect('/');
};


exports.deletePost = async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/');
};
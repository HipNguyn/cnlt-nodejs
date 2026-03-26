const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa cấu trúc của một bài viết gồm Tiêu đề và Nội dung
const BlogPostSchema = new Schema({
    title: String,
    body: String
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost;
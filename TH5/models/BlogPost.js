const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: String,
    body: String
}, { 
    timestamps: true 
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
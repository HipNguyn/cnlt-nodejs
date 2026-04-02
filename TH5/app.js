const express = require('express');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

const app = express();


connectDB();

// Cấu hình
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.set('views', './views');


app.use('/', postRoutes);


app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});

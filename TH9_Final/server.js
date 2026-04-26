const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/index');
const { logger, errorHandler } = require('./middleware/index');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
    secret: 'qnu_super_secret',
    resave: false,
    saveUninitialized: true
}));

app.use(logger);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.use('/', routes);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
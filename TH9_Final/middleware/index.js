const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Lỗi 401: Unauthorized" });
    }
    next();
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Lỗi Server" });
};

module.exports = { logger, requireLogin, errorHandler };
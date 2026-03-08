const http = require('http');

const server = http.createServer((req, res) => {
    // Thiết lập header tiếng Việt [cite: 58]
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    // Xử lý Routing theo yêu cầu [cite: 59, 75]
    if (req.url === '/') {
        res.end('Trang chủ'); // [cite: 76]
    } else if (req.url === '/about') {
        res.end('Trang giới thiệu'); // [cite: 77]
    } else if (req.url === '/contact') {
        res.end('Trang liên hệ'); // [cite: 78]
    } else {
        // Trả về lỗi 404 cho các đường dẫn khác [cite: 63, 79]
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Không tìm thấy trang'); // [cite: 80]
    }
});

// Server chạy tại port 3000 [cite: 56, 74]
server.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});
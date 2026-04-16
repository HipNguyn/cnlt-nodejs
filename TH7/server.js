const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
    
    let urlData = url.parse(req.url, true);
    let pathname = urlData.pathname;

    
    let fileName = "." + (pathname === '/' ? '/views/index.html' : '/views' + pathname);

    
    fs.readFile(fileName, (err, data) => {
        if(err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('404 Not Found');
            return res.end();
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
});


server.listen(8017, '0.0.0.0', () => {
    console.log('Server Bài 7 đang chạy tại: http://localhost:8017');
});
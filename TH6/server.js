const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const myEmitter = require('./events/AppEmitter');
const TextTransform = require('./streams/TextTransform');
const EchoDuplex = require('./streams/EchoDuplex');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    myEmitter.triggerLog('pageVisit', pathname);

    const renderHTML = (fileName, res) => {
        const filePath = path.join(__dirname, 'views', fileName);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Lỗi Server: Không tìm thấy file giao diện!');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
    };

    if (pathname === '/') {
        renderHTML('index.html', res);
    } 
    else if (pathname === '/events') {
        renderHTML('events.html', res);
    } 
    else if (pathname === '/streams') {
        renderHTML('streams.html', res);
    } 
    else if (pathname === '/request') {
        const filePath = path.join(__dirname, 'views', 'request.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (!err) {
                let html = data.replace('{{url}}', req.url)
                               .replace('{{method}}', req.method)
                               .replace('{{query}}', JSON.stringify(parsedUrl.query))
                               .replace('{{headers}}', JSON.stringify(req.headers, null, 2));
                
                res.writeHead(200, { 
                    'Content-Type': 'text/html; charset=utf-8', 
                    'X-Custom-Header': 'HiepNguyen-Dev' 
                });
                res.end(html);
            } else {
                res.writeHead(500);
                res.end('Lỗi đọc file request.html');
            }
        });
    }
    else if (pathname === '/api/stream-text') {
        const readStream = fs.createReadStream(path.join(__dirname, 'data', 'story.txt'));
        const upperCaseStream = new TextTransform();
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        readStream.pipe(upperCaseStream).pipe(res);
    }
    else if (pathname === '/api/read-story') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        fs.createReadStream(path.join(__dirname, 'data', 'story.txt')).pipe(res);
    }
    else if (pathname === '/api/write-log' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const parsedData = new URLSearchParams(body);
            const content = parsedData.get('logdata') || '';
            
            const writeStream = fs.createWriteStream(path.join(__dirname, 'data', 'log.txt'), { flags: 'a' });
            writeStream.write(`[User Input]: ${content}\n`);
            writeStream.end();

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h3>Đã ghi thành công bằng Writable Stream!</h3><a href="/streams">Quay lại</a>');
        });
    }
    else if (pathname === '/api/echo-duplex' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const parsedData = new URLSearchParams(body);
            const content = parsedData.get('echodata') || '';
            
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write('<h3>Kết quả Echo từ Duplex Stream:</h3>');
            
            const duplex = new EchoDuplex();
            duplex.on('data', chunk => res.write(`<h2 style="color:red">${chunk.toString()}</h2>`));
            duplex.on('end', () => res.end('<a href="/streams">Quay lại</a>'));
            
            duplex.write(content);
            duplex.end();
        });
    }
    else if (pathname === '/json') {
        const data = [
            { id: 1, name: "Intel Core i5-12400F", type: "CPU" },
            { id: 2, name: "Nvidia RTX 3060", type: "GPU" }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data));
    }
    else if (pathname === '/download-log') {
        res.writeHead(200, { 
            'Content-Type': 'text/plain', 
            'Content-Disposition': 'attachment; filename="system-log.txt"' 
        });
        fs.createReadStream(path.join(__dirname, 'data', 'log.txt')).pipe(res);
    }
    else if (pathname === '/download-story') {
        res.writeHead(200, { 
            'Content-Type': 'text/plain; charset=utf-8', 
            'Content-Disposition': 'attachment; filename="ban-sao-story.txt"' 
        });
        fs.createReadStream(path.join(__dirname, 'data', 'story.txt')).pipe(res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Không tìm thấy đường dẫn này!');
    }
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Server hoàn chỉnh đang chạy tại: http://localhost:3000');
});
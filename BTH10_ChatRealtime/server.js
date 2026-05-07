const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        users[socket.id] = username;
        console.log(`[HỆ THỐNG] User tham gia: ${username}`);
        io.emit('user_list', { users: users, count: Object.keys(users).length });
    });

    socket.on('private_message', ({ receiverId, message }) => {
        const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const senderName = users[socket.id];
        const receiverName = users[receiverId];

        console.log('\n--- TIN NHẮN MỚI ---');
        console.log('1. Danh sách online:', users);
        console.log('2. Sender (Người gửi):', senderName);
        console.log('3. Receiver (Người nhận):', receiverName);
        console.log('4. Message (Nội dung):', message);
        console.log('5. Time (Thời gian):', time);
        console.log('--------------------\n');

        io.to(receiverId).emit('private_message', {
            senderId: socket.id,
            senderName: senderName,
            message: message,
            time: time,
            isMe: false
        });

        socket.emit('private_message', {
            targetId: receiverId,
            senderName: 'Bạn',
            message: message,
            time: time,
            isMe: true,
            status: 'sent'
        });
    });

    socket.on('mark_as_read', ({ targetId }) => {
        io.to(targetId).emit('message_read', { readerId: socket.id });
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            console.log(`[HỆ THỐNG] User thoát: ${users[socket.id]}`);
            delete users[socket.id];
            io.emit('user_list', { users: users, count: Object.keys(users).length });
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
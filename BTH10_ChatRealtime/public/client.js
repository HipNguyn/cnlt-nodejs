const socket = io();

let myName = '';
let currentChatId = null; 
let chatHistories = {}; 
let onlineUsers = {}; 
let unreadCounts = {}; 

function joinChat() {
    const input = document.getElementById('username-input').value.trim();
    if (input.length > 0) {
        myName = input;
        socket.emit('join', myName);
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
        document.getElementById('my-name-display').innerText = `Tên bạn: ${myName}`;
    }
}

socket.on('user_list', (data) => {
    onlineUsers = data.users;
    document.getElementById('online-count').innerText = `Đang Online (${data.count})`;
    
    let isCurrentChatUserStillOnline = false;
    if (currentChatId && onlineUsers[currentChatId]) {
        isCurrentChatUserStillOnline = true;
    }

    if (currentChatId && !isCurrentChatUserStillOnline) {
        currentChatId = null;
        document.getElementById('chat-with-name').innerText = "Người dùng này đã ngắt kết nối.";
        document.getElementById('chat-input-area').classList.add('hidden');
        document.getElementById('chat-messages').innerHTML = '';
    }

    renderUserList(); 
});

function renderUserList() {
    const userListUl = document.getElementById('user-list');
    userListUl.innerHTML = ''; 

    for (let id in onlineUsers) {
        if (id !== socket.id) { 
            const li = document.createElement('li');
            
            const unread = unreadCounts[id] || 0;
            const badgeHtml = unread > 0 ? `<span class="unread-badge">${unread}</span>` : '';

            li.innerHTML = `<span class="status-dot"></span> ${onlineUsers[id]} ${badgeHtml}`;
            li.onclick = () => selectUser(id, onlineUsers[id]);
            
            if (id === currentChatId) {
                li.classList.add('active');
            }
            userListUl.appendChild(li);
        }
    }
}

function selectUser(id, name) {
    currentChatId = id;
    document.getElementById('chat-with-name').innerText = `Đang chat với: ${name}`;
    document.getElementById('chat-input-area').classList.remove('hidden');
    
    unreadCounts[id] = 0;
    renderUserList(); 

    socket.emit('mark_as_read', { targetId: id });
    renderChatHistory();
}

function sendMessage() {
    const inputField = document.getElementById('message-input');
    const msg = inputField.value.trim();
    if (msg.length > 0 && currentChatId) {
        socket.emit('private_message', { receiverId: currentChatId, message: msg });
        inputField.value = '';
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

socket.on('private_message', (data) => {
    const chatPartnerId = data.isMe ? data.targetId : data.senderId;

    if (!chatHistories[chatPartnerId]) {
        chatHistories[chatPartnerId] = [];
    }
    chatHistories[chatPartnerId].push(data);

    if (currentChatId === chatPartnerId) {
        if (!data.isMe) {
            socket.emit('mark_as_read', { targetId: data.senderId });
        }
        renderChatHistory();
    } else {
        if (!data.isMe) {
            unreadCounts[data.senderId] = (unreadCounts[data.senderId] || 0) + 1;
            renderUserList(); 
        }
    }
});

socket.on('message_read', ({ readerId }) => {
    if (chatHistories[readerId]) {
        chatHistories[readerId].forEach(msg => {
            if (msg.isMe) msg.status = 'read'; 
        });
    }
    if (currentChatId === readerId) renderChatHistory();
});

function renderChatHistory() {
    const chatMessagesDiv = document.getElementById('chat-messages');
    chatMessagesDiv.innerHTML = ''; 

    const history = chatHistories[currentChatId] || [];
    
    history.forEach(chat => {
        const row = document.createElement('div');
        row.className = `msg-row ${chat.isMe ? 'me' : 'other'}`;
        
        let statusHtml = '';
        if (chat.isMe) {
            if (chat.status === 'read') {
                statusHtml = `<span class="msg-status read">Đã xem</span>`;
            } else {
                statusHtml = `<span class="msg-status">Đã gửi</span>`;
            }
        }

        row.innerHTML = `
            <div class="msg-group">
                <div class="msg-box ${chat.isMe ? 'me' : 'other'}">
                    ${chat.message}
                    <span class="msg-time">${chat.time}</span>
                </div>
                ${statusHtml}
            </div>
        `;
        chatMessagesDiv.appendChild(row);
    });
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}
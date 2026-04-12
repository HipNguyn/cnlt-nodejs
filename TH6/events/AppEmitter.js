const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class AppEmitter extends EventEmitter {
    triggerLog(eventName, data, callback) {
        const logMsg = `[${new Date().toISOString()}] Event: ${eventName} | Dữ liệu: ${JSON.stringify(data)}\n`;
        fs.appendFile(path.join(__dirname, '../data/log.txt'), logMsg, (err) => {
            if (err) console.error("Lỗi ghi log:", err);
            if (callback) callback(logMsg);
        });
        this.emit(eventName, data);
    }
}

module.exports = new AppEmitter();
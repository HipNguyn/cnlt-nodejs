const fs = require('fs');
let students = require('../data');

const controllers = {
    login: (req, res) => {
        const { username, password } = req.body;
        if (username === 'admin' && password === '123456') {
            req.session.user = username;
            return res.json({ message: "OK" });
        }
        res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    },
    logout: (req, res) => {
        req.session.destroy();
        res.json({ message: "OK" });
    },
    getStudents: (req, res) => {
        let { name, class: className, sort, page = 1, limit = 2 } = req.query;
        let result = students.filter(s => !s.isDeleted);
        
        if (name) result = result.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
        if (className) result = result.filter(s => s.class === className);
        if (sort === 'age_desc') result.sort((a, b) => b.age - a.age);
        
        page = parseInt(page);
        limit = parseInt(limit);
        const startIndex = (page - 1) * limit;
        const paginatedData = result.slice(startIndex, startIndex + limit);
        
        res.json({ page, limit, total: result.length, data: paginatedData });
    },
    getStudentById: (req, res) => {
        const student = students.find(s => s.id === parseInt(req.params.id) && !s.isDeleted);
        if (!student) return res.status(404).json({ message: "Không tìm thấy" });
        res.json(student);
    },
    createStudent: (req, res) => {
        const { name, email, age, class: className } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name || name.length < 2) return res.status(400).json({ message: "Tên >= 2 ký tự" });
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Email sai định dạng" });
        if (students.find(s => s.email === email && !s.isDeleted)) return res.status(400).json({ message: "Email trùng" });
        if (age < 16 || age > 60) return res.status(400).json({ message: "Tuổi 16-60" });
        
        const newStudent = { 
            id: students.length > 0 ? students[students.length - 1].id + 1 : 1, 
            name, email, age, class: className, isDeleted: false 
        };
        students.push(newStudent);
        res.status(201).json(newStudent);
    },
    updateStudent: (req, res) => {
        const id = parseInt(req.params.id);
        const index = students.findIndex(s => s.id === id && !s.isDeleted);
        if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });
        
        students[index] = { ...students[index], ...req.body };
        res.json(students[index]);
    },
    deleteStudent: (req, res) => {
        const id = parseInt(req.params.id);
        const index = students.findIndex(s => s.id === id && !s.isDeleted);
        if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });
        
        students[index].isDeleted = true;
        res.json({ message: "Đã xóa mềm" });
    },
    heavySync: (req, res) => {
        try {
            fs.readFileSync('./largefile.txt', 'utf8');
            res.json({ message: "Sync Done" });
        } catch (e) {
            res.status(500).json({ message: "Lỗi file" });
        }
    },
    heavyAsync: (req, res) => {
        fs.readFile('./largefile.txt', 'utf8', (err, data) => {
            if (err) return res.status(500).json({ message: "Lỗi file" });
            res.json({ message: "Async Done" });
        });
    },
    getStats: (req, res) => {
        const total = students.length;
        const activeList = students.filter(s => !s.isDeleted);
        const active = activeList.length;
        const deleted = total - active;
        const averageAge = active > 0 ? (activeList.reduce((sum, s) => sum + s.age, 0) / active) : 0;
        res.json({ total, active, deleted, averageAge });
    },
    getClassStats: (req, res) => {
        const activeList = students.filter(s => !s.isDeleted);
        const classCount = {};
        activeList.forEach(s => {
            classCount[s.class] = (classCount[s.class] || 0) + 1;
        });
        const result = Object.keys(classCount).map(className => ({ class: className, count: classCount[className] }));
        res.json(result);
    },
    getProfile: (req, res) => {
        if (req.session.user) return res.json({ user: req.session.user });
        res.status(401).json({ message: "Chưa đăng nhập" });
    }
};

module.exports = controllers;
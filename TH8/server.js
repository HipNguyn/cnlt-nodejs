const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const uploadSingle = multer({ storage: storage }).single("file");
const uploadManyFiles = multer({ storage: storage }).array("many-files", 17);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "master.html"));
});


app.post("/upload", (req, res) => {
    uploadSingle(req, res, (err) => {
        if (err) return res.send("Lỗi upload");
        res.send("Upload thành công");
    });
});


app.post("/upload-many", (req, res) => {
    uploadManyFiles(req, res, (err) => {
        if (err) return res.send("Lỗi upload");
        res.send("Upload nhiều file thành công.");
    });
});

app.listen(8017, '0.0.0.0', () => {
    console.log("Server chạy tại http://localhost:8017");
});
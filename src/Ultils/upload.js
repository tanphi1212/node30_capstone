let multer = require('multer');

let storage = multer.diskStorage({
    destination: process.cwd() + "/public/img",
    filename: (req, file, callback) => {

        // random()
        // date => yyyy-MM-dd-hh-mm-ss+tên file

        let newName = Date.now() + "_" + file.originalname;

        callback(null, newName); // 1660030412312_tony.jpeg
    }
})

let upload = multer({
    storage   // object literal
});
module.exports = upload

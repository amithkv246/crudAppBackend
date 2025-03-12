const multer = require("multer");
const fs = require("fs")
const path = require("path")

const createDirectoryIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory created at ${dir}`);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './images/dp';
        createDirectoryIfNotExists(dir);
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const fileName = `image_${Date.now()}_dp_${path.extname(file.originalname)}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
        return cb(new Error("Only accept images of format png, jpeg, jpg"))
    }
}

const multerUpdateUserConfig = multer({ storage, fileFilter })

module.exports = multerUpdateUserConfig

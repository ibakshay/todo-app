const multer = require("multer")

const MIME_TAP_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TAP_MAP[file.mimetype];
        let error = new Error("invalid mime type");
        if (isValid)
        {
            error = null;
        }
        cb(null, "backend/images");
    },
    filename: (req, file, cb) => {
        const aksahy = "hshs".tolowercase
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TAP_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({ storage: storage }).single("image")
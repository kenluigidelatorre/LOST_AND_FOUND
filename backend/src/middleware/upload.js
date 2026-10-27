const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '../../uploads');
fs.mkdirSync(dir, { recursive: true });

module.exports = multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${file.mimetype === 'image/png' ? '.png' : '.jpg'}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png)$/.test(file.mimetype)) return cb(null, true);
    const e = new Error('Only JPG or PNG images are allowed');
    e.status = 400; e.expose = true;
    cb(e);
  },
});

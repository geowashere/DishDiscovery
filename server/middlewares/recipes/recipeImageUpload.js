function avatarUpload(req, res, next) {
  const multer = require('multer')
  const path = require('path')
  const up_folder = require('path').join(__dirname, '../../assets/recipeImages')

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, up_folder)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const ext = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    },
  })

  const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
      ) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    },
  }).single('rcpImg')

  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Error uploading file',
        error: err.message,
      })
    } else {
      next()
    }
  })
}

module.exports = avatarUpload

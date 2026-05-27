const multer = require('multer')

// store in memory (safe for cloud upload like Cloudinary)
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

module.exports = upload
const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      })
    }

    return res.status(200).json({
      success: true,
      url: req.file.path,
      originalName: req.file.originalname
    })

  } catch (err) {
    console.log("UPLOAD ERROR:", err)

    return res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: err.message || err
    })
  }
})

module.exports = router
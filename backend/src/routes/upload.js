const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const cloudinary = require('../config/cloudinary')
const streamifier = require('streamifier')

router.post('/', upload.single('file'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "collabnotes" },

      (error, result) => {
        if (error) {
          console.log("Cloudinary Error:", error)
          return res.status(500).json({
            success: false,
            error: error.message
          })
        }

        return res.status(200).json({
          success: true,
          url: result.secure_url
        })
      }
    )

    streamifier.createReadStream(req.file.buffer).pipe(stream)

  } catch (err) {
    console.log("UPLOAD ERROR:", err)

    res.status(500).json({
      success: false,
      error: err.message
    })
  }
})

module.exports = router
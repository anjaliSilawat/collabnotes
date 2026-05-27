const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const cloudinary = require('../config/cloudinary')
const streamifier = require('streamifier')

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      })
    }

    // DEBUG (optional but useful on Render)
    console.log("Uploading file:", req.file.originalname)

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "collabnotes"
      },
      (error, result) => {
        if (error) {
          console.log("❌ Cloudinary FULL ERROR:", JSON.stringify(error, null, 2))

          return res.status(500).json({
            success: false,
            message: "Cloudinary upload failed",
            error: error.message
          })
        }

        return res.status(200).json({
          success: true,
          url: result.secure_url,
          originalName: req.file.originalname,
          public_id: result.public_id
        })
      }
    )

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream)

  } catch (err) {
    console.log("❌ UPLOAD ROUTE ERROR:", err)

    res.status(500).json({
      success: false,
      message: "Server error during upload",
      error: err.message
    })
  }
})

module.exports = router
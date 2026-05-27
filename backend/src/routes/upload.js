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

    console.log("Uploading file:", req.file.originalname)

    // ✅ FIX: decide resource type properly
    const isImage = req.file.mimetype.startsWith('image/')
    const resourceType = isImage ? "image" : "raw"

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "collabnotes",
        resource_type: resourceType,   // ⭐ IMPORTANT FIX
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {

        if (error) {
          console.log("❌ Cloudinary Error:", error)

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
          resource_type: result.resource_type
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
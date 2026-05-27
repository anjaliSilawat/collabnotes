const express = require('express')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const router = express.Router()

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'collabnotes',
    resource_type: 'auto'
  })
})

const upload = multer({ storage })

router.post(
  '/',
  upload.single('file'),
  async (req, res) => {

    try {

      res.json({
        url: req.file.path,
        originalName: req.file.originalname
      })

    } catch (err) {

      res.status(500).json({
        message: 'Upload failed'
      })
    }
  }
)

module.exports = router
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        '.' +
        file.originalname.split('.').pop()
    )
  }
})

const upload = multer({ storage })

async function compressImage(file, quality) {
  const compressedFilePath = path.join(
    file.destination,
    'compressed',
    file.filename
  )

  await sharp(file.path)
    .resize({ width: 500, height: 500, fit: 'inside' }) // Resize the image
    .jpeg({ quality }) // Set the compression quality
    .toFile(compressedFilePath) // Save the compressed image

  fs.unlinkSync(file.path) // Delete the original file

  return compressedFilePath
}

module.exports = { upload, compressImage }

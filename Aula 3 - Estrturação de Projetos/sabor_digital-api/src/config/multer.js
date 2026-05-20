const multer = require('multer')
const path = require('path')

// diskStorage: Define os arquivos serão salvos no disco do servidor.
const storage = multer.diskStorage({
    // Define onde o arquivo será salvo
    destination: (req, file, cb) => {
        cb(null, path.resolve('uploads'))
    },
    // Define o nome do arquivo salvo
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }
})

module.exports = multer({storage})
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFiles = (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json('No files were uploaded.');
        return;
    }

    const { file } = req.files;

    const cortName = file.name.split('.');
    const extension = cortName[cortName.length - 1];

    //Validate extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (!validExtensions.includes(extension)) {
        return res.status(400).json({
            message: `Invalid file type, extension valid : ${validExtensions}`
        });
    }
    const fileName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads', fileName);

    file.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).json(err);
        }

        res.json('File uploaded to ' + uploadPath);
    });
}

module.exports = {
    uploadFiles,
}
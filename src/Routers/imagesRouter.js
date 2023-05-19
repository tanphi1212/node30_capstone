const express = require('express');
const imagesRouter = express.Router();
const {
    uploadImage,
    getImages,
    getImagesByName,
    getImagesById,
    checkSaveImage
} = require('../Controller/imagesController');

const upload = require('../Ultils/upload');

const { checkToken, privateAPI } = require('../Ultils/jwt');

imagesRouter.post('/upload',privateAPI,upload.single('file'),uploadImage);
imagesRouter.get('/get-images', getImages)
imagesRouter.get('/get-images-by-name',getImagesByName)
imagesRouter.get('/get-image/:hinh_id',getImagesById)
imagesRouter.get('/save-image/:hinh_id',privateAPI,checkSaveImage)

module.exports = imagesRouter;
const express = require('express');
const commentRouter = express.Router();
const {
    getCommentByImage,
    addCommentByImage
} = require('../Controller/commentController');

const upload = require('../Ultils/upload');

const { checkToken, privateAPI } = require('../Ultils/jwt');

commentRouter.get("/image/:hinh_id",getCommentByImage)

commentRouter.post("/image/:hinh_id",privateAPI,addCommentByImage)

module.exports = commentRouter;
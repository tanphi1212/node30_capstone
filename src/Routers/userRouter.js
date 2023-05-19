const express = require('express');
const userRouter = express.Router();
const {
    signUp,
    loginUser,
    getUser,
    getImagesByUser,
    getSaveByUser,
    deleteImagesByUser,
    uploadAvatar,
    updateUser
} = require('../Controller/userController');

const upload = require('../Ultils/upload');

const { checkToken, privateAPI } = require('../Ultils/jwt');

userRouter.post('/sign-up', signUp);
userRouter.post('/login', loginUser);
userRouter.get('/detail',privateAPI,getUser);
userRouter.get('/get-images',privateAPI,getImagesByUser);
userRouter.get('/get-saves',privateAPI,getSaveByUser);
userRouter.delete('/delete-image/:hinh_id',privateAPI,deleteImagesByUser);
userRouter.post('/update-avatar',upload.single('file'),privateAPI,uploadAvatar);
userRouter.put('/update',privateAPI,updateUser);

module.exports = userRouter;
const express = require('express');
const userRouter = require('./userRouter');
const imagesRouter = require('./imagesRouter')
const commentRouter = require('./commentRouter')
const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/images", imagesRouter);
rootRouter.use("/comment", commentRouter);


module.exports = rootRouter;
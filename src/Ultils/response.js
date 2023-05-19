// 200
const successCode = (res, message, data) => {
    res.status(200).json({
        statusCode: 200,
        message,
        data
    });
}

// 400
const failCode = (res, message, data) => {
    res.status(400).json({
        statusCode: 400,
        message,
        data
    });
}

// 500
const errorCode = (res, message) => {
    res.status(500).json({
        statusCode: 500,
        message
    });
}

module.exports = {
    successCode,
    failCode,
    errorCode
}
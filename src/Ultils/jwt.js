const jwt = require('jsonwebtoken');
const { successCode } = require('./response');

// tạo token
const generateToken = (data) => {

    // data: string, number, object, buffer => ko có tham số thứ 3, nếu có thì ko dc truyền string

    let token = jwt.sign(data, "node-30", { algorithm: "HS256", expiresIn: "10m" });

    return token;
}

// kiểm tra token
const checkToken = (token) => {
    let data = jwt.verify(token, "node-30");
    return data;
}

// giải mã token
const decodeToken = (token) => {
    return jwt.decode(token);
}

const privateAPI = (req, res, next) => {

    let { refreshToken } = req.params;
    try {
        // kiểm tra token
        let { token } = req.headers;

        checkToken(token);
        next();
    } catch (err) {

        if (err.name == "TokenExpiredError" && refreshToken == true) {
            let token = generateToken(checkUser.dataValues);
            successCode(res, token, "");
        } else {
            res.status(401).send(err.message);
        }

    }

}

module.exports = {
    generateToken,
    checkToken,
    decodeToken,
    privateAPI
}
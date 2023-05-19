const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


const { successCode, errorCode, failCode } = require('../Ultils/response');
const { generateToken, decodeToken } = require('../Ultils/jwt')


const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        let { email, mat_khau, ho_ten, tuoi } = req.body;
        let data = {
            email,
            mat_khau: bcrypt.hashSync(mat_khau, 10),
            ho_ten,
            tuoi
        };

        let checkEmail = await prisma.nguoi_dung.findFirst({
            where: {
                email: email
            }
        })

        if (checkEmail) {
            failCode(res, "email đã tồn tại", "");
            return;
        }

        await prisma.nguoi_dung.create({ data });

        successCode(res, "Đã tạo người dùng thành công", " ");
    } catch (err) {
        errorCode(res, "lỗi BE");
    }
}

const loginUser = async (req, res) => {
    let { email, mat_khau } = req.body;

    let checkUser = await prisma.nguoi_dung.findFirst({
        where: {
            email
        }
    })

    if (checkUser) {
        let checkPass = bcrypt.compareSync(mat_khau, checkUser.mat_khau);
        console.log(checkUser);
        if (checkPass == true) {
            let token = generateToken(checkUser)
            successCode(res, "Đăng nhập thành công", token)
        } else {
            failCode(res, "không đúng mật khẩu", "")
        }
    } else {
        failCode(res, "Không tìm thấy email", "")
    }
}


const getUser = async (req, res) => {
    try {
        let { token } = req.headers;

        let nguoi_dung = decodeToken(token);

        successCode(res, "Lấy dữ liệu thành công", nguoi_dung);

    } catch {
        errorCode(res, "lỗi BE")
    }
}

const getImagesByUser = async (req, res) => {
    try {
        let { token } = req.headers;

        let nguoi_dung = decodeToken(token);

        let data = await prisma.hinh_anh.findMany({
            where: {
                nguoi_dung_id: nguoi_dung.nguoi_dung_id,
            }
        })

        successCode(res, "lấy dữ liệu thành công", data)

    } catch {
        errorCode(res, "lỗi BE")
    }
}

const getSaveByUser = async (req, res) => {
    try {
        let { token } = req.headers;

        let nguoi_dung = decodeToken(token);

        let data = await prisma.luu_anh.findMany({
            where: {
                nguoi_dung_id: nguoi_dung.nguoi_dung_id,
            }
        })

        successCode(res, "lấy dữ liệu thành công", data)
    } catch {
        errorCode(res, "lỗi BE")
    }
}

const uploadAvatar = async (req, res) => {

    try {
        let { token } = req.headers;

        let nguoi_dung = decodeToken(token);


        const fs = require('fs');

        let file = req.file;
        // 5Kb = 5000B
        if (file.size > 5000000) {
            failCode(res, "File large ", "");
            return;
        }

        // file.size > 1 000 000



        fs.readFile(process.cwd() + "/public/img/" + file.filename, async (err, data) => {

            // băm hình thành base64
            let base64 = `data:${file.mimetype};base64,${Buffer.from(data).toString("base64")}`;

            //xóa hình
            fs.unlink(process.cwd() + "/public/img/" + file.filename, () => { });

            await prisma.nguoi_dung.update({
                where: {
                    nguoi_dung_id: nguoi_dung.nguoi_dung_id
                },
                data: {
                    anh_dai_dien: base64
                }
            });

            successCode(res, "thêm ảnh thành công", "");

        })

    } catch {
        errorCode(res, "lỗi BE")
    }
}




const deleteImagesByUser = async (req, res) => {
    let { token } = req.headers;

    let nguoi_dung = decodeToken(token);

    let { hinh_id } = req.params;

    hinh_id = parseInt(hinh_id);

    let checkCreated = await prisma.hinh_anh.findFirst({
        where: {
            nguoi_dung_id: nguoi_dung.nguoi_dung_id,
            hinh_id,
            isDelete: null
        }
    });

    if (checkCreated) {
        await prisma.hinh_anh.update({
            where: {
                hinh_id
            },
            data: {
                isDelete: 1,
            }

        })
        successCode(res, "đã xóa", "")
    } else {
        failCode(res, "lỗi")
    }

}

const updateUser = async (req, res) => {
    try {
        let { token } = req.headers;

        let nguoi_dung = decodeToken(token);

        let { ho_ten, tuoi } = req.body;
        let data = {
            ho_ten,
            tuoi
        };

        await prisma.nguoi_dung.update({
            where: {
                nguoi_dung_id: nguoi_dung.nguoi_dung_id,
            },
            data
        })
        successCode(res, "đã update", "")
    } catch {
        errorCode(res,"lỗi BE")
    }
}

module.exports = {
    signUp,
    loginUser,
    getUser,
    getImagesByUser,
    getSaveByUser,
    deleteImagesByUser,
    uploadAvatar,
    updateUser,
}


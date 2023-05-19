
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const { successCode, errorCode, failCode } = require('../Ultils/response');

const { decodeToken } = require('../Ultils/jwt')



const getCommentByImage = async (req, res) => {
    try {
        let { hinh_id } = req.params;

        hinh_id = parseInt(hinh_id);

        let data = await prisma.binh_luan.findMany({
            where: {
                hinh_id,
            },
            include: {
                nguoi_dung: true,
            }
        })
        successCode(res, "lấy dữ liệu thành công", data)
    } catch {
        errorCode(res, "lỗi BE");
    }
}

const addCommentByImage = async (req, res) => {
   try{
    let { token } = req.headers;

    let nguoi_dung = decodeToken(token);
    
    console.log(nguoi_dung)

    let { hinh_id } = req.params;

    hinh_id = parseInt(hinh_id);

    let { noi_dung } = req.body;

    let data = {
        nguoi_dung_id: nguoi_dung.nguoi_dung_id,
        hinh_id,
        noi_dung,
        ngay_binh_luan: new Date()
    }

    await prisma.binh_luan.create({data})

    successCode(res,"tạo dữ liệu thành công","")
   }catch{
        errorCode(res, "lỗi BE");
   }
}


module.exports = {
    getCommentByImage,
    addCommentByImage,
}

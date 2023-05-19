const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const { successCode, errorCode, failCode } = require('../Ultils/response');

const { decodeToken } = require('../Ultils/jwt')


const getImages = async (req,res) => {
    try{
        let data = await prisma.hinh_anh.findMany({})

        successCode(res,"Lấy dữ liệu thành công", data)
    }catch{
        errorCode(res,"lỗi BE");
    }
}

const getImagesByName = async (req,res) => {
    try{
        let name = req.query.name;

        let data = await prisma.hinh_anh.findMany({
            where: {
                ten_hinh: {
                    contains: name,
                },
                isDelete: null,
            }
        })
        if(data.length === 0){
            successCode(res,"không có dữ liệu trùng","");
            return;
        }
        successCode(res,"lấy dữ liệu thành công", data)
    
    } catch {
        errorCode(res,"lỗi BE")
    }
   
}

const getImagesById = async (req,res) => {
    try{
        let { hinh_id } = req.params;

        hinh_id = parseInt(hinh_id);

        let data = await prisma.hinh_anh.findFirst({
            where : {
                hinh_id,
                isDelete: null,
            }, 
            include: {
                nguoi_dung: true,
            }
        })
        if(!data){
            failCode(res,"Id hình ảnh không đúng","")
            return;
        }

        successCode(res,"lấy dữ liệu thành công", data)

    } catch{
        errorCode(res,"lỗi BE")
    }
}

const checkSaveImage = async (req, res) => {
    let { token } = req.headers;

    let nguoi_dung = decodeToken(token);

    let {hinh_id} = req.params;

    hinh_id = parseInt(hinh_id);

    let checkSave = await prisma.luu_anh.findFirst({where:{
        hinh_id,
        nguoi_dung_id: nguoi_dung.nguoi_dung_id,
        
    }})

    if(checkSave){
        successCode(res,"đã lưu","")
    }else{
        successCode(res,"chưa lưu",)
    }
}


const uploadImage = async (req, res) => {

    try{
        let { token } = req.headers;

    let nguoi_dung = decodeToken(token);

    let { ten_hinh, mo_ta } = req.body;

    console.log(nguoi_dung)

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


        let image = {
            ten_hinh,
            mo_ta,
            nguoi_dung_id: nguoi_dung.nguoi_dung_id,
            duong_dan: base64,
        }

        await prisma.hinh_anh.create({ data: image });

        successCode(res,"thêm ảnh thành công", "");

    })

    } catch{
        errorCode(res,"lỗi BE")
    }
}



module.exports = {
    uploadImage,
    getImages,
    getImagesByName,
    getImagesById,
    checkSaveImage
}

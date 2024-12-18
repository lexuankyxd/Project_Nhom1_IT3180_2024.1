const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* Giả sử Schema và Model người dùng
const userSchema = new mongoose.Schema({
    keyNguoiDung: String,
    idNguoiDung: String,
    tenNguoiDung: String,
    anhDaiDien: String,
    queQuan: String,
    soThich: [String],
    soLuongBanBe: Number,
    danhSachBanBe: [String], // Danh sách ID bạn bè
    danhSachBaiVietBanThan: [
        { idBaiViet: String, anhBaiViet: String }
    ]
});

const User = mongoose.model('User', userSchema);
*/

// API thêm bạn bè
app.post('/removeFriend', async (req, res) => {
    const { idNguoiDung, idBanBe } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!idNguoiDung || !idBanBe) {
        return res.status(400).json({
            success: false,
            message: 'Missing idNguoiDung or idBanBe'
        });
    }

    try {
        // Tìm người dùng hiện tại
        const user = await User.findOne({ idNguoiDung });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Kiểm tra nếu bạn bè chưa tồn tại trong list friend
        if (!user.danhSachBanBe.includes(idBanBe)) {
            return res.status(400).json({
                success: false,
                message: `This user is your friend`
            });
        }

        // Xóa bạn bè và cập nhật số lượng bạn bè
        user.danhSachBanBe.pop(idBanBe);
        user.soLuongBanBe = user.danhSachBanBe.length;

        // Lưu cập nhật vào MongoDB
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Friend removed successfully',
            data: {
                danhSachBanBe: user.danhSachBanBe,
                soLuongBanBe: user.soLuongBanBe
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

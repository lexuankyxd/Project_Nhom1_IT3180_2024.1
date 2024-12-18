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

// Kiểm tra kết nối MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const User = mongoose.model('User', userSchema);

// API xem profile người dùng
app.post('/viewProfile', async (req, res) => {
    const { keyNguoiDung, idNguoiDung } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!keyNguoiDung || !idNguoiDung) {
        return res.status(400).json({
            success: false,
            message: 'Missing keyNguoiDung or idNguoiDung'
        });
    }

    try {
        // Tìm người dùng trong MongoDB
        const user = await User.findOne({ keyNguoiDung, idNguoiDung });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Trả về thông tin người dùng
        return res.status(200).json({
            success: true,
            message: 'User profile fetched successfully',
            data: {
                tenNguoiDung: user.tenNguoiDung,
                anhDaiDien: user.anhDaiDien,
                idNguoiDung: user.idNguoiDung,
                queQuan: user.queQuan,
                soThich: user.soThich,
                soLuongBanBe: user.soLuongBanBe,
                danhSachBaiVietBanThan: user.danhSachBaiVietBanThan
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

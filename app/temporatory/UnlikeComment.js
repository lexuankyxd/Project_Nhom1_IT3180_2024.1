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

const User = mongoose.model('Post', postSchema);

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

// API like comment
app.post('/unlikeFriend', async (req, res) => {
    const { idNguoiDung, idBaiViet, idBinhLuan } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!idNguoiDung || !idBaiViet || !idBinhLuan) {
        return res.status(400).json({
            success: false,
            message: 'Missing idNguoiDung or idBaiViet or idBinhLuan'
        });
    }

    try {
        // Tìm bình luận hiện tại
        const comment = await Post.findOne({ idBinhLuan });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        

        // UnlUnlike bình luận và cập nhật số lượng like
        comment.like.pop(idNguoiDung);
        comment.likeQuantity =comment.like.length;

        // Lưu cập nhật vào MongoDB
        await post.save();

        return res.status(200).json({
            success: true,
            message: 'Liked successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

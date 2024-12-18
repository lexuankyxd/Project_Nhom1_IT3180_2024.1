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

// API like comment
app.post('/likeComment', async (req, res) => {
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

        // Kiểm tra nếu chưa like thì like, đã like thì bỏ like
        if (comment.like.includes(idNguoiDung)) {
            comment.like.pop(idNguoiDung);
            return res.status(400).json({
                success: true,
                message: 'Comment unlike successfully'
            });
        }
        if (!comment.like.includes(idNguoiDung)) {
            comment.like.push(idNguoiDung);
            return res.status(400).json({
                success: true,
                message: 'Comment like successfully'
            });
        }

        // Cập nhật số lượng bạn bè
        comment.likeQuantity = comment.like.length;

        // Lưu cập nhật vào MongoDB
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Comment like's status changed successfully`,
            data: {
                soLuotLike: comment.likeQuantity
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

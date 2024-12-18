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
app.post('/addComment', async (req, res) => {
    const { idNguoiDung, idBaiViet, BinhLuan } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!idNguoiDung || !idBaiViet || !BinhLuan) {
        return res.status(400).json({
            success: false,
            message: 'Missing idNguoiDung or idBaiViet or BinhLuan'
        });
    }

    try {
        // Tìm bài viết hiện tại
        const post = await Post.findOne({ idBaiViet });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Tạo bình luận mới
        var newComment = {
            idNguoiDung,
            idBaiViet,
            BinhLuan
        };
        post.comment.push(newComment);

        // Cập nhật số lượng bình luận của bài viết
        post.commentQuantity++;

        // Lưu cập nhật vào MongoDB
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Commented successfully`,
            data: {
                soLuotComment: post.commentQuantity
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

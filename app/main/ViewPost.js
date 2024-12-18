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

// API xem post
app.post('/viewPost', async (req, res) => {
    const { keyNguoiDung, idBaiviet } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!keyNguoiDung || !idBaiViet) {
        return res.status(400).json({
            success: false,
            message: 'Missing keyNguoiDung or idBaiViet'
        });
    }

    try {
        // Tìm post trong MongoDB
        const post = await Post.findOne({ idBaiviet });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Trả về thông tin người dùng
        return res.status(200).json({
            success: true,
            message: 'Post fetched successfully',
            data: {
                anhBaiViet: Post.anhBaiViet,
                noiDungBaiViet: Post.noiDungBaiViet,
                viTriBaiViet: Post.viTriBaiViet,
                soLuotThich: Post.like.length,
                soBinhLuan: Post.comment.length,
                trangThaiLike: Post.likeStatus,
                binhLuan: Post.comment
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

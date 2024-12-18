const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware để parse body của request
app.use(bodyParser.json());

// API gửi tin nhắn
app.post('/send-message', (req, res) => {
    const { to, message } = req.body;

    // Kiểm tra xem dữ liệu có hợp lệ không
    if (!to || !message) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: to, message'
        });
    }

    // Giả lập gửi tin nhắn
    console.log(`Sending message to ${to}: ${message}`);

    // Trả về phản hồi thành công
    return res.status(200).json({
        success: true,
        message: 'Message sent successfully',
        data: {
            to,
            message
        }
    });
});
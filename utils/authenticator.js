import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
  let token;
  // Kiểm tra token trong Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Giải mã và lấy thông tin user từ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Thêm user vào request object
      req.user = await User.findById(decoded.id).select("-password"); // Loại bỏ mật khẩu
      if (req.user == null) throw "Tài khoản không tồn tại";
      next(); // Cho phép tiếp tục vào route tiếp theo
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Không có quyền truy cập, token không hợp lệ" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có token, yêu cầu xác thực" });
  }
};

const adminProtect = async (req, res, next) => {
  let token;
  // Kiểm tra token trong Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Giải mã và lấy thông tin user từ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role != "admin") throw "Khong phai admin!";
      // Thêm user vào request object
      req.user = await Admin.findById(decoded.id).select("-password"); // Loại bỏ mật khẩu
      next(); // Cho phép tiếp tục vào route tiếp theo
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Không có quyền truy cập, token không hợp lệ" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có token, yêu cầu xác thực" });
  }
};

module.exports = { protect: protect, adminProtect: adminProtect };

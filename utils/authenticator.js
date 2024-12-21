import jwt from "jsonwebtoken";
export async function protect(req, res, next) {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.body.account_id = decoded.account_id;
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
}

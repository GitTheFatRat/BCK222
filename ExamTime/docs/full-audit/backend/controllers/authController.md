# backend/controllers/authController.js

## Muc dich (1-2 cau)
File này xử lý toàn bộ logic nghiệp vụ liên quan đến xác thực người dùng (Authentication). Bao gồm các chức năng: Đăng ký tài khoản mới (Register), Đăng nhập (Login), và Lấy thông tin tài khoản hiện tại (Get Me).

## Import / phu thuoc
- `import jwt from 'jsonwebtoken';`: Để tạo ra JSON Web Token (ký token) sau khi đăng nhập thành công.
- `import bcrypt from 'bcryptjs';`: Dùng để băm (hash) mật khẩu khi đăng ký và so sánh (compare) mật khẩu khi đăng nhập, đảm bảo mật khẩu gốc không bao giờ bị lộ.
- `import User from '../models/User.js';`: Model người dùng tương tác trực tiếp với cơ sở dữ liệu MongoDB.

## Noi dung chi tiet
- **Các hằng số**:
  - `SALT_ROUNDS = 10`: Mức độ phức tạp khi tạo salt để băm mật khẩu (10 là mức cân bằng tốt giữa bảo mật và hiệu năng).
  - `TOKEN_EXPIRY = '7d'`: Thời gian sống của JWT là 7 ngày.
- **Hàm `signToken(user)`**: Hàm tiện ích (helper) dùng để sinh ra JWT. Nó đóng gói `_id` và `role` của người dùng vào payload, và ký bằng `process.env.JWT_SECRET`.
- **Hàm `register(req, res)`**:
  - Nhận `username`, `email`, `password` từ body.
  - Ràng buộc: Bắt buộc điền đủ 3 trường, mật khẩu tối thiểu 6 ký tự.
  - Dùng `User.findOne` kết hợp toán tử `$or` để kiểm tra xem `username` hoặc `email` đã tồn tại trong DB chưa. Trả về `400` nếu trùng lặp.
  - Băm mật khẩu bằng `bcrypt.genSalt` và `bcrypt.hash`.
  - Tạo instance `newUser` và `.save()` vào DB. Trả về `201 Created`.
- **Hàm `login(req, res)`**:
  - Nhận `email` và `password`.
  - Tìm user qua `email`. Nếu không thấy, trả về `401 Invalid credentials` (Thông báo chung chung để tránh lộ thông tin email có tồn tại hay không).
  - Dùng `bcrypt.compare` để đối chiếu mật khẩu nhập vào với mã băm trong DB. Nếu sai, cũng trả về `401`.
  - Nếu đúng, gọi `signToken()` và trả về token cùng với cục thông tin user (để frontend lưu vào Redux/localStorage).
- **Hàm `getMe(req, res)`**:
  - Lấy `req.user.id` (được gán từ `authMiddleware`).
  - Dùng `User.findById` kèm lệnh `.select('-password_hash')` để lấy thông tin user nhưng **loại bỏ** trường mật khẩu băm, tránh gửi dữ liệu nhạy cảm xuống client.
  - Trả về thông tin user.

## Duoc su dung boi (dependents)
- `backend/routes/authRoutes.js`: Gắn các hàm controller này vào các endpoint API (`/register`, `/login`, `/me`).

## Diem dang chu y (neu co)
- **Bảo mật**: Việc sử dụng thông báo lỗi chung chung "Invalid credentials" (thay vì "Sai mật khẩu" hay "Email không tồn tại") là một phương pháp chuẩn (best practice) để chống lại kỹ thuật dò tìm tài khoản (User Enumeration Attack).
- Lỗi `500 Internal server error` được bắt trong khối `catch` để tránh làm crash (sập) server nếu có lỗi từ Database. Tuy nhiên, nó chỉ log ra console chứ chưa dùng hệ thống log chuyên nghiệp (như Winston hay Sentry).

# backend/middlewares/authMiddleware.js

## Muc dich (1-2 cau)
File này đóng vai trò là lớp bảo mật chính yếu để xác thực người dùng. Nó kiểm tra xem request gửi lên từ client có chứa token hợp lệ (JWT) hay không trước khi cho phép truy cập vào các route được bảo vệ.

## Import / phu thuoc
- `import jwt from 'jsonwebtoken'`: Sử dụng thư viện `jsonwebtoken` để giải mã (verify) token được client gửi lên.

## Noi dung chi tiet
- **`authMiddleware(req, res, next)`**: Middleware function được chèn vào giữa vòng đời của một request.
  - Khởi đầu bằng việc lấy giá trị `Authorization` từ `req.headers`.
  - `if (!authHeader || !authHeader.startsWith('Bearer'))`: Kiểm tra định dạng chuẩn của token. Token phải được đính kèm ở header dưới dạng `Bearer <token>`. Nếu không có, lập tức từ chối với mã `401 Unauthorized`.
  - `const token = authHeader.split(' ')[1];`: Tách chuỗi để lấy phần `<token>` thực sự (bỏ chữ "Bearer ").
  - `try/catch` block:
    - Sử dụng `jwt.verify(token, process.env.JWT_SECRET)` để giải mã. Quá trình này sẽ tự động ném ra lỗi (throw error) nếu token bị giả mạo, sai chữ ký, hoặc đã hết hạn (expired).
    - `req.user = decoded;`: Nếu token hợp lệ, thông tin được mã hóa bên trong token (payload) sẽ được gán vào `req.user`. Payload này thường chứa `userId` và `role` của người dùng.
    - `next()`: Cho phép request tiếp tục đi tới middleware hoặc controller tiếp theo.
    - Nếu có lỗi, trả về `401 Invalid Token`.

## Duoc su dung boi (dependents)
- `backend/routes/resultRoutes.js`: Bảo vệ toàn bộ các route liên quan đến việc nộp bài, xem lịch sử, và chấm điểm.
- `backend/routes/authRoutes.js`: Sử dụng cho route lấy thông tin profile hiện tại (`/me`).
- `backend/routes/adminRoutes.js`: Được sử dụng (cùng với `adminMiddleware`) để bảo vệ các thao tác quản trị như ingest data.

## Diem dang chu y (neu co)
- **Ràng buộc Môi trường**: File này phụ thuộc tuyệt đối vào biến môi trường `process.env.JWT_SECRET`. Nếu server chưa cấu hình biến này trong file `.env`, lệnh `jwt.verify` sẽ ném lỗi và toàn bộ hệ thống đăng nhập/xác thực sẽ sụp đổ.
- **Tiền đề cho các Middleware khác**: Việc gán `req.user = decoded` là mấu chốt. Các middleware đứng sau (như `adminMiddleware`) phụ thuộc hoàn toàn vào object `req.user` này để hoạt động. Do đó, `authMiddleware` luôn luôn phải được gọi đầu tiên trong chuỗi middlewares bảo vệ route.

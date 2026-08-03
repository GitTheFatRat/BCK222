# backend/routes/authRoutes.js

## Muc dich (1-2 cau)
File này định nghĩa các endpoint liên quan đến tài khoản người dùng, bao gồm chức năng đăng ký, đăng nhập và lấy thông tin cá nhân. Nó là cầu nối giữa các request HTTP từ phía client và các logic xử lý bên trong `authController`.

## Import / phu thuoc
- `Router` từ `express`: Để tạo bộ định tuyến (router) module hóa.
- `register`, `login`, `getMe`: Import từ `authController.js` để thực thi logic tương ứng với từng đường dẫn.
- `authMiddleware`: Lấy từ `authMiddleware.js` để bảo vệ các route cần yêu cầu đăng nhập.

## Noi dung chi tiet
- Tạo một `router` mới bằng `Router()`.
- **`router.post('/register', register);`**: Định nghĩa API đăng ký. Vì là route public, nó gọi trực tiếp `register` controller mà không qua bất kỳ middleware nào.
- **`router.post('/login', login);`**: Định nghĩa API đăng nhập. Tương tự như `/register`, nó hoàn toàn public.
- **`router.get('/me', authMiddleware, getMe);`**: API lấy thông tin profile hiện tại (thường được frontend gọi ngay sau khi login thành công để lấy data đưa vào Redux). Bắt buộc phải truyền qua `authMiddleware` trước để chứng minh token hợp lệ, sau đó mới gọi controller `getMe`.
- `export default router;`: Xuất router.

## Duoc su dung boi (dependents)
- `backend/server.js`: Nhập và gắn vào đường dẫn gốc `/api/auth`. Các endpoint thực tế sẽ là `POST /api/auth/register`, `POST /api/auth/login`, và `GET /api/auth/me`.

## Diem dang chu y (neu co)
- **Thiết kế RESTful gọn gàng**: File router này rất dễ đọc vì nó tuân thủ chuẩn Express Router, tách biệt rõ ràng phần định tuyến và phần xử lý logic (controller).
- Các API trả về mật khẩu hay không, hay báo lỗi thế nào, tất cả đều được đóng gói kín kẽ ở Controller. Tuy nhiên, nếu sau này muốn thêm các tính năng như "Quên mật khẩu" hay "Đổi mật khẩu", file này sẽ là nơi đầu tiên được mở ra để khai báo route.

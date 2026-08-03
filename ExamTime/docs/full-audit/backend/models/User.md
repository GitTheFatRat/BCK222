# backend/models/User.js

## Muc dich (1-2 cau)
File này định nghĩa schema và model quản lý thông tin tài khoản của người dùng (bao gồm học sinh và quản trị viên). Đây là nền tảng cho tính năng xác thực (authentication) và phân quyền (authorization) trong hệ thống.

## Import / phu thuoc
- `import mongoose from 'mongoose';`: Cần thiết để tạo Schema và tương tác với collection `users` trong MongoDB.

## Noi dung chi tiet
- **`userSchema`**: Cấu trúc dữ liệu của một người dùng.
  - `username`: Tên hiển thị/tên đăng nhập của người dùng. Ràng buộc bắt buộc (`required`), duy nhất (`unique`), cắt khoảng trắng (`trim`), và giới hạn độ dài từ 3 đến 30 ký tự.
  - `email`: Địa chỉ email. Ràng buộc duy nhất, bắt buộc, tự động đưa về chữ thường (`lowercase: true`) để tránh lỗi phân biệt hoa/thường khi login.
  - `password_hash`: Chuỗi mật khẩu đã được mã hóa (băm - hashed). Tuyệt đối không lưu mật khẩu gốc (plaintext).
  - `role`: Vai trò của người dùng. Sử dụng enum để giới hạn chỉ được nhận 2 giá trị: `student` (học sinh) hoặc `admin` (quản trị). Mặc định khi đăng ký mới sẽ là `student`.
- Đi kèm `{ timestamps: true }` để tự động lưu ngày tạo tài khoản.
- **`export default mongoose.model('User', userSchema);`**: Xuất model.

## Duoc su dung boi (dependents)
- `backend/controllers/authController.js`: Sử dụng trực tiếp để xử lý logic đăng ký (tạo User mới) và đăng nhập (tìm User theo email và so sánh password_hash).
- Gián tiếp sử dụng làm tham chiếu (reference) trong `backend/models/ExamResult.js` thông qua trường `user`.

## Diem dang chu y (neu co)
- Schema này không tự chứa logic mã hóa mật khẩu (ví dụ dùng pre-save hook của Mongoose với bcrypt). Thay vào đó, việc băm mật khẩu được thực hiện ở tầng Controller (`authController.js`) trước khi lưu vào DB. Điều này giúp schema nhẹ nhàng và tách biệt hoàn toàn khỏi thư viện mã hóa.
- `username` và `email` đều được đánh index duy nhất (`unique: true`), nghĩa là MongoDB sẽ báo lỗi (duplicate key error) nếu cố tình tạo tài khoản trùng lặp. Code ở tầng controller cần phải try/catch lỗi này để trả về message thân thiện cho frontend.

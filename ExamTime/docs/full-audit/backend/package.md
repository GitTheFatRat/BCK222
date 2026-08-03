# backend/package.json

## Muc dich (1-2 cau)
File cấu hình tiêu chuẩn của Node.js, dùng để khai báo thông tin dự án, cấu hình các lệnh chạy script, và đặc biệt là liệt kê danh sách các thư viện phụ thuộc (dependencies) cần thiết để server backend hoạt động.

## Import / phu thuoc
(Không có import. Bản thân file này là nơi định nghĩa các package npm mà ứng dụng phụ thuộc vào).

## Noi dung chi tiet
- `"type": "module"`: **Rất quan trọng**. Khai báo này cho phép Node.js sử dụng cú pháp ES Modules (`import/export`) thay vì CommonJS (`require()`). Nhờ vậy mà toàn bộ code backend của dự án có thể viết theo cú pháp hiện đại giống hệt như frontend.
- **`scripts`**:
  - `"dev": "node --watch server.js"`: Lệnh chạy trong quá trình phát triển (development). Sử dụng cờ `--watch` (tính năng mới của Node.js từ v18.11+) để tự động khởi động lại server mỗi khi có file thay đổi, thay thế cho thư viện bên thứ 3 như `nodemon`.
  - `"start": "node server.js"`: Lệnh dùng khi chạy thật trên môi trường Production.
- **`dependencies`**:
  - `express`: Framework core để tạo web server.
  - `mongoose`: Giao tiếp với MongoDB.
  - `dotenv`: Load biến môi trường.
  - `cors`: Xử lý lỗi bảo mật Cross-Origin.
  - `jsonwebtoken` & `bcryptjs`: Xử lý bảo mật, mã hóa, đăng nhập.
  - `multer`: Xử lý upload file.

## Duoc su dung boi (dependents)
- Môi trường Node.js và NPM. Khi chạy `npm install` trong thư mục backend, NPM sẽ đọc file này để tải các thư viện về thư mục `node_modules`.

## Diem dang chu y (neu co)
- Node.js bản mới đã tích hợp sẵn `--watch`, giúp giảm bớt một devDependency (như `nodemon`), làm project nhẹ hơn.
- Không thấy mảng `devDependencies` (ví dụ như ESLint, Prettier, hay Jest). Điều này cho thấy backend đang được code khá "thuần" và chưa có hệ thống tự động test (Unit Test) hay linting mã nguồn.

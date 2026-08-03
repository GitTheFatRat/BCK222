# backend/config/db.js

## Muc dich (1-2 cau)
File này chịu trách nhiệm thiết lập kết nối từ ứng dụng Node.js (thông qua thư viện Mongoose) đến cơ sở dữ liệu MongoDB. Nó bao gồm logic kết nối lại tự động (retry) nếu lần kết nối đầu tiên thất bại.

## Import / phu thuoc
- `import mongoose from "mongoose";`: Thư viện ODM (Object Data Modeling) phổ biến nhất để tương tác với MongoDB.

## Noi dung chi tiet
- **`connectDB()`**: Hàm bất đồng bộ (async) để thực hiện việc kết nối.
  - Sử dụng vòng lặp `while` để cấu hình cơ chế thử lại (Retry Mechanism). Giới hạn tối đa là 3 lần (`maxRetry = 3`).
  - Lệnh `mongoose.connect(process.env.MONGO_URI)` kết nối tới DB bằng chuỗi connection string lấy từ file `.env`. Nếu thành công, in ra log và thoát vòng lặp (`return`).
  - Nếu có lỗi văng ra ở khối `catch`: 
    - Tăng biến đếm `attempt`.
    - Nếu đã thử đủ 3 lần (`attempt >= maxRetry`), log lỗi và tắt nóng server bằng lệnh `process.exit(1)` (chương trình kết thúc với mã lỗi 1).
    - Nếu vẫn còn lượt thử, nó sẽ chờ một khoảng thời gian (delay) tăng dần trước khi thử lại: `1000 * Math.min(attempt, 5)` mili-giây.
- **Sự kiện `disconnected`**: Gắn một event listener toàn cục (global) vào `mongoose.connection`. Nếu trong quá trình chạy, Database đột ngột bị ngắt kết nối (ví dụ rớt mạng, sập DB), nó sẽ in ra cảnh báo màu vàng (`console.warn`) để lập trình viên/quản trị viên chú ý.

## Duoc su dung boi (dependents)
- `backend/server.js`: Được gọi ngay ở những dòng đầu tiên khi server khởi động để đảm bảo ứng dụng chỉ chạy khi đã có database.

## Diem dang chu y (neu co)
- **Thiếu logic tự động phục hồi**: Mặc dù file có bắt sự kiện `disconnected`, nhưng nó không tự động gọi lại hàm `connectDB()` khi kết nối bị đứt gánh giữa chừng. Ở môi trường Production, nếu MongoDB khởi động lại, server Node.js hiện tại sẽ bị "treo" với cảnh báo `[DB] Disconnected...` mà không tự động khôi phục. Cần cấu hình thêm tùy chọn `autoReconnect` (hoặc phó thác cho công cụ quản lý process như PM2/Docker tự khởi động lại Node server).

# backend/server.js

## Muc dich (1-2 cau)
File này là điểm neo (Entry Point) của toàn bộ ứng dụng backend. Nó khởi tạo server Express, cấu hình các middleware toàn cục (CORS, JSON parsing), kết nối Database, gắn các Router API, và bắt đầu lắng nghe các request từ client.

## Import / phu thuoc
- **Thư viện bên thứ ba**: `express` (tạo server), `cors` (cho phép gọi API chéo domain), `dotenv` (đọc biến môi trường).
- **Node.js core**: `fs` (FileSystem, dùng để tạo các thư mục upload).
- **Module nội bộ**: `connectDB` và 4 module Routes (`authRoutes`, `examRoutes`, `adminRoutes`, `resultRoutes`).

## Noi dung chi tiet
- `dotenv.config()`: Phải được gọi đầu tiên để load các biến từ file `.env` vào `process.env`.
- **Khởi tạo thư mục tĩnh**: Gọi `fs.mkdirSync(..., { recursive: true })` để đảm bảo 3 thư mục `uploads/exams`, `uploads/speaking`, `uploads/writing` luôn tồn tại khi server chạy, tránh lỗi "No such file or directory" khi user lưu file.
- **Middleware toàn cục**:
  - `app.use(cors())`: Cho phép Frontend (chạy ở cổng 5173) gọi API tới Backend (chạy ở cổng 5000) mà không bị lỗi CORS Policy.
  - `app.use(express.json())`: Tự động parse body của các request có Content-Type là `application/json`.
  - `app.use('/uploads', express.static('uploads'))`: Cấu hình phục vụ file tĩnh (Static File Server). Nếu client request `http://localhost:5000/uploads/audio.mp3`, Express sẽ trả file audio đó về.
- **Mounting Routes**: Gắn 4 cụm routes chính vào 4 endpoint tương ứng (`/api/auth`, `/api/exams`, `/api/admin`, `/api/results`).
- **Health Check**: Có một route `/api/health` trả về `status: 'ok'` dùng để kiểm tra xem server có đang sống hay không (rất hữu ích khi deploy lên các dịch vụ cloud như AWS, k8s).
- **Global Error Handler**: Bắt tất cả các lỗi văng ra từ quá trình xử lý (mà không được bắt bằng try/catch) và trả về HTTP 500 để tránh server bị crash đột ngột.
- **Bootstrapping**: Gọi hàm `connectDB()`. Bằng cách sử dụng `.then()`, server Express `app.listen()` **chỉ được khởi động** sau khi Database đã kết nối thành công.

## Duoc su dung boi (dependents)
- Được gọi trực tiếp bởi Node.js khi chạy lệnh `npm run dev` (hoặc `node server.js`). Mọi luồng xử lý của backend đều đi qua đây đầu tiên.

## Diem dang chu y (neu co)
- Thiết kế **Chờ DB trước khi Listen** ở dòng 39 (`connectDB().then(...)`) là một Best Practice rất tốt. Nó đảm bảo server không bao giờ nhận request khi Database chưa sẵn sàng, tránh được hàng loạt lỗi 500 do mất kết nối.
- Việc tạo thư mục bằng `fs.mkdirSync` chặn luồng chính (synchronous blocking) lúc khởi động, nhưng vì nó chỉ chạy 1 lần lúc boot server nên không ảnh hưởng đến hiệu năng xử lý request sau này.

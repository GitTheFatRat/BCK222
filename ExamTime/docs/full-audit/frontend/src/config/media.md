# frontend/src/config/media.js

## Muc dich (1-2 cau)
File này cung cấp một hàm tiện ích (utility function) duy nhất để chuyển đổi các đường dẫn tương đối (relative path) của file âm thanh/hình ảnh nhận được từ Database thành đường dẫn tuyệt đối (absolute URL) trỏ tới Backend Server.

## Import / phu thuoc
(Không có import bên ngoài, chỉ sử dụng `import.meta.env` của Vite để đọc biến môi trường).

## Noi dung chi tiet
- Lấy `API_BASE_URL` từ biến môi trường (ví dụ `http://localhost:5000/api`).
- Xử lý chuỗi (Regex) để cắt đuôi `/api`, sinh ra `BACKEND_ORIGIN` (ví dụ `http://localhost:5000`).
- Hàm **`getMediaUrl(path)`**:
  - Nhận vào tham số `path` (đường dẫn). Nếu `path` rỗng, trả về chuỗi rỗng.
  - Nếu `path` đã bắt đầu bằng `http://` hoặc `https://` (ví dụ ảnh lưu ngoài S3), nó sẽ giữ nguyên không làm gì cả.
  - Nếu `path` là dạng đường dẫn tương đối lưu ở local (như `/uploads/exams/TEST01_audio_1.mp3`), nó sẽ nối (concatenate) chuỗi `BACKEND_ORIGIN` vào đầu để tạo thành URL hoàn chỉnh: `http://localhost:5000/uploads/exams/TEST01_audio_1.mp3`.

## Duoc su dung boi (dependents)
- `frontend/src/pages/PracticeRoom.jsx` và `ExamRoom.jsx`: Dùng để nạp đường dẫn âm thanh phần Listening (lấy từ trường `audioUrl` trong DB) vào thẻ `<audio>`.
- `frontend/src/features/writing/WritingEditor.jsx`: Dùng để hiển thị hình ảnh minh họa cho đề Writing (chứa biểu đồ, sơ đồ) lấy từ trường `imageUrl` trong DB.

## Diem dang chu y (neu co)
- Đây là một đoạn code xử lý cực kỳ thiết thực. Nhờ có file này, khi dự án được deploy (ví dụ: frontend trên Vercel, backend trên Render), hệ thống sẽ tự động chỉ định đúng đường dẫn tĩnh của file MP3 trỏ về backend đang chạy mà không bị lỗi 404 (file không tìm thấy).

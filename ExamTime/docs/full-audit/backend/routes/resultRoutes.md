# backend/routes/resultRoutes.js

## Muc dich (1-2 cau)
File này định nghĩa các endpoint liên quan đến kết quả bài thi. Nó phục vụ cả học sinh (nộp bài, tải lên file ghi âm Speaking, xem lịch sử thi) và giáo viên/quản trị viên (xem danh sách chờ chấm, chấm điểm thủ công, xem log gian lận).

## Import / phu thuoc
- `Router` từ `express`.
- `multer`: Thư viện middleware mạnh mẽ của Node.js chuyên dùng để xử lý dữ liệu dạng `multipart/form-data`, đặc biệt là để upload file (trong trường hợp này là file ghi âm).
- Các hàm từ `resultController.js` chứa logic xử lý.
- `authMiddleware`, `adminMiddleware` để phân quyền bảo mật.

## Noi dung chi tiet
- **Cấu hình Multer**:
  - Tạo `storage` kiểu `diskStorage`.
  - `destination`: Chỉ định thư mục lưu trữ file tạm là `uploads/speaking/`.
  - `filename`: Đổi tên file gốc để tránh trùng lặp, format là `<userId>-<timestamp>.webm`.
  - `const upload = multer({ storage });`: Khởi tạo middleware `upload`.
- **Routes cho Học viên (Student)**:
  - `router.post('/submit', authMiddleware, upload.single('speakingRecording'), submitResult);`: Route nộp bài. Khác với các route JSON thông thường, route này có kẹp thêm middleware `upload.single('speakingRecording')` để hứng file ghi âm (nếu có) trước khi nhảy vào `submitResult`.
  - `router.get('/me', authMiddleware, getMyResults);`: Lấy lịch sử làm bài của bản thân.
- **Routes cho Admin/Teacher**:
  - `router.get('/admin/pending', authMiddleware, adminMiddleware, ...)`: Lấy bài chưa chấm.
  - `router.put('/admin/:id/grade', authMiddleware, adminMiddleware, ...)`: Chấm điểm một bài thi cụ thể.
  - `router.get('/admin/cheating-logs', authMiddleware, adminMiddleware, ...)`: Lấy danh sách gian lận.

## Duoc su dung boi (dependents)
- `backend/server.js`: Nhập và mount vào endpoint gốc `/api/results`.

## Diem dang chu y (neu co)
- **Bảo mật thư mục Upload**: `multer` ở đây ghi trực tiếp file vào hệ thống file local (`uploads/speaking/`). Ở quy mô production thực tế, thư mục này có thể bị tràn ổ cứng hoặc mất dữ liệu khi server restart (nếu deploy trên container như Docker/Heroku). Tốt nhất là cấu hình `multer` đẩy thẳng lên S3 hoặc Cloudinary, nhưng đối với dự án này thì việc lưu local là chấp nhận được.
- Đuôi file được gán cứng (hardcode) là `.webm` trong hàm sinh tên file. Điều này có nghĩa frontend bị bắt buộc phải ghi âm và gửi định dạng webm. Nếu frontend đổi sang mp4 hay mp3, tên file lưu trên server vẫn bị ép là `.webm`, gây sai lệch định dạng.

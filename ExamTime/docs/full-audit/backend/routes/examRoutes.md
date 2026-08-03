# backend/routes/examRoutes.js

## Muc dich (1-2 cau)
File này định nghĩa các tuyến đường để truy xuất dữ liệu đề thi (Exams). Đây là các API công khai (public) cho phép frontend hiển thị danh sách đề và lấy chi tiết đề thi mà không bắt buộc người dùng phải đăng nhập.

## Import / phu thuoc
- `Router` từ `express`.
- `getAllExams`, `getExamByCode` từ `examController.js`: Xử lý logic truy vấn DB.
- `filterExamMiddleware` từ `filterExamMiddleware.js`: Để lọc bỏ đáp án đúng khỏi dữ liệu đề thi trả về (nếu request là để làm bài thi).

## Noi dung chi tiet
- Tạo đối tượng `router`.
- **`router.get('/', getAllExams);`**: Xử lý request GET tới gốc của route này (tương đương `/api/exams`). Trả về danh sách tất cả các bài thi (chỉ bao gồm tên và mã).
- **`router.get('/:code', filterExamMiddleware, getExamByCode);`**: 
  - Lấy chi tiết một bài thi dựa vào param `code` trên URL.
  - Sử dụng `filterExamMiddleware` chặn ở giữa: Nếu frontend gọi API này với tham số `?mode=exam` (chế độ thi thật), middleware sẽ tự động "rửa sạch" (sanitize) toàn bộ đáp án `correctAnswer` và `explanation` trước khi dữ liệu được gửi về client, ngăn chặn gian lận. Ngược lại nếu không có mode này, dữ liệu gốc sẽ được trả về.
  - `getExamByCode` là controller cuối cùng chịu trách nhiệm móc data từ Database.
- Khai báo `export default router`.

## Duoc su dung boi (dependents)
- `backend/server.js`: Nhập và mount vào endpoint gốc `/api/exams`.

## Diem dang chu y (neu co)
- Các route trong file này **không** sử dụng `authMiddleware`. Nghĩa là bất kỳ ai (kể cả khách vãng lai chưa có tài khoản) cũng có thể xem danh sách đề thi và xem nội dung đề thi. Việc bảo vệ chức năng "Nộp bài" được xử lý riêng ở `resultRoutes`. Sự phân tách này giúp SEO tốt hơn và thu hút người dùng chưa đăng ký.

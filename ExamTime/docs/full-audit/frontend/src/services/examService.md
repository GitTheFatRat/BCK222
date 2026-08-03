# frontend/src/services/examService.js

## Muc dich (1-2 cau)
File này đóng gói các lệnh gọi API liên quan đến việc lấy dữ liệu Đề thi (Exams) từ backend.

## Import / phu thuoc
- `apiClient` từ `../config/axios.js`: Instance axios để gọi HTTP request.

## Noi dung chi tiet
Cung cấp 2 hàm:
- **`getExam()`**: Gọi `GET /api/exams`. Trả về danh sách tất cả các bài thi đang có trên hệ thống (dùng để hiển thị ngoài trang chủ).
- **`getExamByCode(code, mode = 'practice')`**: Gọi `GET /api/exams/:code`. 
  - Điểm đặc biệt là nó truyền thêm tham số `mode` qua URL query params (`?mode=practice` hoặc `?mode=exam`).
  - Dựa vào tham số `mode` này, Backend (thông qua `filterExamMiddleware`) sẽ quyết định xem có ẩn đi đáp án đúng (`correctAnswer`) và giải thích (`explanation`) hay không. Mặc định là `practice` (hiển thị hết).

## Duoc su dung boi (dependents)
- `frontend/src/pages/HomeDashboard.jsx`: Gọi `getExam()` để render danh sách thẻ bài thi.
- `frontend/src/pages/PracticeRoom.jsx`: Gọi `getExamByCode` với chế độ `practice` để luyện tập (thấy đáp án ngay).
- `frontend/src/pages/ExamRoom.jsx`: Gọi `getExamByCode` với chế độ `exam` để thi thật (bị ẩn đáp án).
- `frontend/src/pages/ResultSummary.jsx`: Lấy lại nội dung bài thi để đối chiếu với câu trả lời của user.

## Diem dang chu y (neu co)
- Thiết kế truyền `mode` (Practice vs Exam) ngay từ tầng Service là một kiến trúc khá linh hoạt. Nó cho phép frontend tái sử dụng lại 100% UI của phòng thi, chỉ khác biệt ở dữ liệu nhận về có đáp án đúng hay không.

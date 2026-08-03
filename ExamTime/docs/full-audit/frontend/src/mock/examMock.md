# frontend/src/mock/examMock.json

## Muc dich (1-2 cau)
File này chứa dữ liệu giả lập (mock data) dưới định dạng JSON, mô phỏng lại cấu trúc của một bài thi IELTS hoàn chỉnh (gồm 4 kỹ năng Listening, Reading, Writing, Speaking). Ban đầu, file này được tạo ra để các lập trình viên Frontend có thể thiết kế giao diện phòng thi (ExamRoom) ngay lập tức mà không cần chờ đợi Backend phải xây dựng xong Database và API.

## Import / phu thuoc
- Không có (Đây chỉ là file dữ liệu tĩnh).

## Noi dung chi tiet
- Định nghĩa một cấu trúc bài thi siêu khổng lồ (hơn 200 dòng):
  - `examId`: "cambridge19-test01", `title`: "Cambridge IELTS 19 - Test 1".
  - `durationMinutes`: Quy định thời gian cho từng kỹ năng.
  - Phân hệ `listening`: Chứa `audioUrl` và mảng `sections`. Đi sâu vào trong là cấu trúc `questions` (gồm câu hỏi, loại câu hỏi `gap-fill`/`multiple-choice`, đáp án đúng `correctAnswer`, và lời giải thích `explanation`).
  - Tương tự cho các phân hệ `reading`, `writing-task1`, `writing-task2`, `speaking`. Cấu trúc này phản ánh chính xác 100% Schema Mongoose `Exam` ở dưới Backend.

## Duoc su dung boi (dependents)
- **Không có (Dead Code/Legacy)**: Trong giai đoạn đầu, file này có thể được import tạm thời vào `ExamRoom.jsx` (`import mockData from '../mock/examMock.json'`) để test giao diện. Tuy nhiên, hiện tại dự án đã liên kết thành công với Backend thực (thông qua `examService.js`). Vì thế, file này không còn được sử dụng ở bất kỳ đâu trong Source Code.

## Diem dang chu y (neu co)
- Mặc dù là Dead Code, file này cực kỳ **có giá trị tham khảo** về mặt Document. Nó cung cấp cho các lập trình viên vào sau cái nhìn tổng quan, trực quan nhất về việc một Object "Bài thi" trông như thế nào khi đi từ Backend xuống Frontend, giúp họ dễ dàng hình dung cấu trúc dữ liệu để viết logic render. Do đó, có thể không cần xóa vội mà giữ lại làm tài liệu tham chiếu (Reference).

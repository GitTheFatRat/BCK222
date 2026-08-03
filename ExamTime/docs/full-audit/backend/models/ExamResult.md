# backend/models/ExamResult.js

## Muc dich (1-2 cau)
File này định nghĩa schema và model để lưu trữ kết quả làm bài thi của người dùng. Mỗi khi người dùng nộp bài (một kỹ năng lẻ hoặc toàn bộ bài), một document `ExamResult` sẽ được tạo ra để lưu trữ đáp án, điểm số, và log gian lận.

## Import / phu thuoc
- `import mongoose from 'mongoose';`: Để sử dụng Schema và tạo model làm việc với collection `examresults` trong MongoDB.

## Noi dung chi tiet
- **`examResultSchema`**: Định nghĩa các trường lưu trữ cho kết quả thi.
  - `user`: ObjectId tham chiếu đến bảng `User`, xác định ai là người làm bài.
  - `exam`: ObjectId tham chiếu đến bảng `Exam`, xác định bài thi nào được làm.
  - `skill`: Kỹ năng được thi (`listening`, `reading`, `writing-task1`, `writing-task2`, `speaking`, `full`). Cho biết kết quả này thuộc phần nào của bài thi.
  - `sessionId`: Chuỗi định danh duy nhất (UUID) cho phiên thi hiện tại, giúp chống nộp bài trùng lặp. Có đánh index (`index: true`) để truy vấn nhanh.
  - `answers`: Kiểu `Mixed` (có thể là object bất kỳ). Lưu trữ toàn bộ đáp án trắc nghiệm/điền từ của Listening và Reading theo dạng `{ questionId: "answer" }`.
  - `writingTask1Text`, `writingTask2Text`: Lưu trữ nội dung bài luận của phần thi Writing.
  - `speakingRecordingUrl`: Lưu đường dẫn (URL) đến file ghi âm của phần thi Speaking (thường upload qua Cloudinary hoặc S3).
  - `scores`: Object chứa điểm (band) của từng kỹ năng và điểm tổng (overall). Mặc định là `null` vì có những kỹ năng (Writing, Speaking) cần thời gian chấm thủ công.
  - `cheatingLog`: Mảng chứa các cảnh báo gian lận (ví dụ: chuyển tab, copy/paste). Mỗi phần tử gồm `timestamp` và `type`. `_id: false` giúp Mongoose không tự động sinh `_id` cho từng phần tử con này.
  - `status`: Trạng thái của bài thi. `SUBMITTED` (vừa nộp, chờ chấm), `GRADING` (đang chấm), `GRADED` (đã chấm xong).
- **`{ timestamps: true }`**: Tự động lưu thời gian nộp bài (`createdAt`).

## Duoc su dung boi (dependents)
- `backend/controllers/resultController.js`: Sử dụng trực tiếp để lưu kết quả khi user nộp bài, tính điểm tự động cho Reading/Listening, và truy xuất lịch sử làm bài để trả về dashboard.

## Diem dang chu y (neu co)
- **Kiểu dữ liệu Mixed cho `answers`**: Việc sử dụng `mongoose.Schema.Types.Mixed` cho đáp án rất linh hoạt nhưng cũng tiềm ẩn rủi ro vì Mongoose không thể tự động nhận diện thay đổi sâu bên trong object (nếu update thủ công bằng code thay vì gán đè).
- **Cơ chế chống spam/nộp trùng**: Nhờ có `sessionId` (được sinh ra từ frontend mỗi khi bắt đầu phiên mới), hệ thống có thể dễ dàng reject nếu một `sessionId` đã tồn tại trong database (đã được submit).

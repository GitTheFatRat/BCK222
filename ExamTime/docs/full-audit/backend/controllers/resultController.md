# backend/controllers/resultController.js

## Muc dich (1-2 cau)
File này là trái tim của hệ thống chấm điểm và lưu trữ kết quả. Nó đảm nhận việc xử lý bài nộp của thí sinh, tự động chấm điểm cho Reading/Listening dựa trên thang điểm chuẩn (band scale), gom nhóm các bài thi lẻ tẻ thành một phiên thi (session) hoàn chỉnh, và cung cấp API cho giáo viên/admin để chấm điểm thủ công (Writing/Speaking).

## Import / phu thuoc
- `fs/promises`: Đọc file `bandScale.json`.
- `mongoose`: Dùng để kiểm tra `ObjectId.isValid`.
- Models (`ExamResult`, `Exam`, `ListeningSet`, `ReadingSet`): Để truy vấn đề thi, lưu kết quả bài làm, và tra cứu đáp án đúng.

## Noi dung chi tiet
- **Các hàm helper (chấm điểm)**:
  - `loadBandScale()`: Đọc và parse file `bandScale.json` (chỉ đọc 1 lần nhờ biến global `bandScale`), trả về bảng quy đổi điểm số.
  - `countCorrectAnswers(userAnswers, questions)`: Duyệt qua danh sách câu hỏi của đề thi, so khớp `userAnswers[qId]` với `question.correctAnswer`, trả về tổng số câu đúng.
  - `lookupBand(scaleList, correctCount)`: Đối chiếu số câu đúng với bảng quy đổi để ra được Band Score (chấm điểm từ 1.0 đến 9.0).
  - `calculateOverallBand` & `calculateSessionOverallBand`: Tính điểm trung bình cộng (Overall Band) của 4 kỹ năng và làm tròn đến `0.5` gần nhất theo chuẩn IELTS.
- **Hàm `submitResult(req, res)`**: API cốt lõi khi user bấm "Nộp bài".
  - Nhận `examId`, `skill`, `sessionId`, `answers`, `cheatingLog`, và các file/text phụ trợ.
  - Tìm bài thi (`Exam`) dựa trên `examId` (hỗ trợ cả ObjectId và chuỗi Code fallback).
  - Khởi tạo object `scores` mặc định là `null`.
  - Nếu kỹ năng nộp là `listening` hoặc `reading`: Lấy dữ liệu câu hỏi từ Database, gọi `countCorrectAnswers` và `lookupBand` để chấm điểm ngay lập tức.
  - Nếu kỹ năng là `writing-task1`, `writing-task2`, `speaking`: Đếm số lượng từ, nếu trống (<= 2 từ) thì cho ngay 1.0. Nếu có làm bài thì đánh dấu `requiresManualGrading = true`.
  - Tạo một document `ExamResult` mới. Nếu `requiresManualGrading` thì `status` là `GRADING` (chờ chấm), ngược lại là `GRADED` (đã chấm xong).
- **Hàm `getMyResults(req, res)`**: Hiển thị lịch sử làm bài cho Dashboard của học viên.
  - Lấy tất cả `ExamResult` của user.
  - Dùng logic **Gom nhóm bằng SessionId** (Session Aggregation): Vì user nộp riêng lẻ từng kỹ năng (mỗi kỹ năng sinh ra 1 document), hàm này dùng `sessionMap` để gom 4 kỹ năng có chung `sessionId` lại thành 1 dòng lịch sử hoàn chỉnh.
  - Gọi `calculateSessionOverallBand` để tính điểm Overall cho cả bộ.
- **Các hàm Admin (`getPendingGradingTasks`, `gradeResult`, `getCheatingLogs`)**:
  - `getPendingGradingTasks`: Lọc ra các bài Writing/Speaking có trạng thái `GRADING` để giáo viên vào chấm.
  - `gradeResult`: Cập nhật điểm (`writingBand` hoặc `speakingBand`), chuyển `status` thành `GRADED`, và tính lại `overallBand`.
  - `getCheatingLogs`: Lấy lịch sử gian lận của tất cả học sinh (chuyển tab, mất focus).

## Duoc su dung boi (dependents)
- `backend/routes/resultRoutes.js`: Gắn vào endpoint `/api/results/...` cho cả role Student (nộp bài, xem lịch sử) và role Admin (chấm bài).

## Diem dang chu y (neu co)
- **Thiết kế Single Responsibility lỏng lẻo (God Object)**: File này hiện đang ôm đồm quá nhiều việc (tính toán logic chấm điểm, gom nhóm session, xử lý HTTP request, gọi Database). Ở các dự án lớn, phần helper chấm điểm thường phải tách ra một file `gradingService.js` riêng biệt để dễ viết Unit Test.
- **Lỗ hổng xử lý đồng thời (Race Condition) trong điểm Overall**: Nếu user nộp 2 kỹ năng (Writing và Speaking) và giáo viên chấm cả 2 cùng một lúc, thao tác cập nhật `overallBand` trong hàm `gradeResult` có thể bị ghi đè lên nhau.
- Object `userAnswers` được so sánh bằng toán tử `===` với `correctAnswer`. Điều này có nghĩa nó chưa xử lý triệt để việc đáp án đúng là một mảng (ví dụ: `['color', 'colour']`). Đây có thể là một bug tiềm ẩn trong tương lai nếu đề thi nhập vào dạng mảng.

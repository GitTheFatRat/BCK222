# Sơ đồ Cơ sở Dữ liệu (Database Schema)

Dự án ExamTime sử dụng MongoDB, một cơ sở dữ liệu dạng NoSQL. Thay vì lưu dưới dạng bảng như Excel (SQL), dữ liệu được lưu dưới dạng các **Document** (tài liệu JSON).

## Các Bộ sưu tập (Collections)

### 1. User (Người dùng)
Lưu thông tin về tài khoản người dùng đăng nhập hệ thống.
- `_id` (ObjectId): Mã định danh duy nhất của người dùng.
- `username` (String): Tên hiển thị của người dùng (từ 3-30 ký tự, phải duy nhất).
- `email` (String): Địa chỉ email dùng để đăng nhập (phải duy nhất).
- `password_hash` (String): Mật khẩu đã được mã hóa (băm) để bảo mật.
- `role` (String): Quyền hạn, có thể là `'student'` (học viên) hoặc `'admin'` (quản trị viên).

### 2. Exam (Bài kiểm tra tổng hợp)
Đại diện cho một bài thi IELTS/Exam hoàn chỉnh, bao gồm 4 kỹ năng.
- `_id` (ObjectId): Mã bài thi.
- `title` (String): Tên hiển thị (ví dụ: "Cam 16 Test 1").
- `code` (String): Mã đề thi duy nhất (ví dụ: "CAM16-T1").
- `listeningSet`, `readingSet`, `writingSet`, `speakingSet` (ObjectId): Trỏ tới các phần thi kỹ năng tương ứng.
- `isPublished` (Boolean): Trạng thái đã xuất bản để học sinh có thể thấy hay chưa.

### 3. ListeningSet (Đề thi Nghe)
- `_id` (ObjectId): Mã đề nghe.
- `sections` (Array): Danh sách các phần thi nghe (Thường là 4 section). Mỗi section chứa:
  - `sectionNumber` (Number): Số thứ tự section.
  - `audioUrl` (String): Đường dẫn tới file âm thanh.
  - `questions` (Array): Danh sách các câu hỏi trong section này.

### 4. ReadingSet (Đề thi Đọc)
- `_id` (ObjectId): Mã đề đọc.
- `passages` (Array): Danh sách các đoạn văn (Thường là 3 passage). Mỗi passage chứa:
  - `passageNumber` (Number): Số thứ tự passage.
  - `title` (String): Tiêu đề đoạn văn.
  - `text` (String): Nội dung bài đọc.
  - `questions` (Array): Danh sách câu hỏi của đoạn văn này.

### 5. WritingSet (Đề thi Viết)
- `_id` (ObjectId): Mã đề viết.
- `task1`, `task2` (Object): Chứa chi tiết yêu cầu viết.
  - `prompt` (String): Đề bài yêu cầu.
  - `imageUrl` (String): Hình ảnh đính kèm (nếu có, thường cho Task 1).
  - `minWords` (Number): Số từ tối thiểu.

### 6. SpeakingSet (Đề thi Nói)
- `_id` (ObjectId): Mã đề nói.
- `part1` (Array of Strings): Danh sách câu hỏi Part 1.
- `part2` (Object): Gồm `cueCard` (đề bài), `prepSeconds` (thời gian chuẩn bị), `talkSeconds` (thời gian nói).
- `part3` (Array of Strings): Danh sách câu hỏi Part 3.

### 7. ExamResult (Kết quả làm bài)
Lưu kết quả của một lần nộp bài của học sinh.
- `_id` (ObjectId): Mã kết quả.
- `user` (ObjectId): Trỏ tới User đã làm bài.
- `exam` (ObjectId): Trỏ tới Exam tương ứng.
- `skill` (String): Kỹ năng được nộp (ví dụ: `'listening'`, `'writing-task1'`, `'full'`).
- `sessionId` (String): Mã phiên làm bài chung để gom nhóm các kỹ năng làm trong cùng một lần thi.
- `answers` (Mixed): Chứa các câu trả lời dạng trắc nghiệm/điền từ.
- `writingTask1Text`, `writingTask2Text` (String): Nội dung bài viết do học sinh nộp.
- `speakingRecordingUrl` (String): Đường dẫn tới file ghi âm bài nói.
- `scores` (Object): Chứa điểm của từng kỹ năng và điểm trung bình (overallBand).
- `status` (String): Trạng thái chấm điểm (`'SUBMITTED'`, `'GRADING'`, `'GRADED'`).
- `cheatingLog` (Array): Lịch sử cảnh báo gian lận (chuyển tab, thoát toàn màn hình).

---

## Mối Quan hệ giữa các Bộ sưu tập (Relationships)

Dưới đây là các mối quan hệ theo định dạng chuẩn:

  Exam --references--> ListeningSet (via Exam.listeningSet, one-to-one)
  Exam --references--> ReadingSet (via Exam.readingSet, one-to-one)
  Exam --references--> WritingSet (via Exam.writingSet, one-to-one)
  Exam --references--> SpeakingSet (via Exam.speakingSet, one-to-one)
  ExamResult --references--> User (via ExamResult.user, many-to-one)
  ExamResult --references--> Exam (via ExamResult.exam, many-to-one)
  ExamResult --groups-by--> sessionId (many ExamResult documents share one sessionId, representing one overall attempt at an exam across multiple skill submissions)

---

## Embedded (Nhúng) vs Referenced (Tham chiếu)

**Tham chiếu (Referenced):**
Giống như bạn để lại một địa chỉ nhà (ObjectId) để chỉ định nơi chứa thông tin.
- *Ví dụ:* `ExamResult.user` chỉ lưu `_id` của User.
- *Tại sao?* Nếu học sinh đổi tên hoặc email, ta chỉ cần cập nhật ở 1 chỗ (bảng User). Các bảng khác dùng ObjectId tham chiếu sẽ tự động đọc được tên mới. Điều này cũng giúp `Exam` kết nối với các kỹ năng khác biệt (`ListeningSet`, `ReadingSet`) một cách độc lập để dễ quản lý.

**Nhúng (Embedded):**
Giống như bạn bỏ toàn bộ đồ đạc vào chung một chiếc vali.
- *Ví dụ:* Danh sách `questions` nằm lọt thỏm bên trong mảng `sections` của `ListeningSet`.
- *Tại sao?* Bởi vì câu hỏi là thứ luôn luôn được sử dụng CÙNG LÚC với Section đó. Chẳng ai cần lấy 1 câu hỏi lẻ loi mà không cần biết đoạn audio của nó là gì. Nhúng vào chung 1 tài liệu giúp tốc độ đọc dữ liệu cực nhanh chỉ với 1 lần tìm kiếm, thay vì phải tìm nhiều bảng khác nhau.

---

## ObjectId là gì và tại sao làm _id?

**ObjectId** là một chuỗi ký tự dài 24 chữ số hệ thập lục phân (hex) do MongoDB tự động sinh ra, ví dụ: `64a7c8...`.
- *Tại sao dùng nó làm `_id`?* Trong các hệ thống SQL cũ, id thường là số tự tăng (1, 2, 3...). Nhưng với MongoDB - một hệ thống có thể chạy trên hàng trăm máy chủ cùng lúc, việc tính số tự tăng rất chậm và dễ trùng lặp. ObjectId được sinh ra dựa trên: Thời gian hiện tại + Mã máy chủ + Mã tiến trình + Số đếm ngẫu nhiên. Điều này đảm bảo mỗi ObjectId sinh ra luôn là **Độc nhất vô nhị** trên toàn cầu mà không cần các máy chủ phải hỏi nhau.

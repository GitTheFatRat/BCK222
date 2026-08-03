# frontend/src/pages/ResultSummary.jsx

## Muc dich (1-2 cau)
File này định nghĩa trang Tổng kết kết quả (Result Summary), xuất hiện ngay sau khi người dùng nộp bài thi hoặc khi họ bấm vào xem lại lịch sử thi. Trang này cung cấp cái nhìn toàn cảnh về điểm số (Overall Band), điểm từng kỹ năng, và đặc biệt là bảng đáp án chi tiết (Answer Key) đối chiếu giữa câu trả lời của học sinh và đáp án đúng.

## Import / phu thuoc
- `useState`, `useEffect` từ `react`.
- `useLocation`, `Link`, `useNavigate` từ `react-router-dom`.
- `getExamByCode` từ `../services/examService.js`: Để kéo bộ đề (dạng practice) về lấy `correctAnswer`.
- `getMyResultHistory` từ `../services/resultService.js`: Để lấy điểm số từ Database.

## Noi dung chi tiet
- Lấy thông tin điều hướng (`state`) từ `useLocation()`. Bắt buộc phải có `sessionId` và `examCode` truyền vào, nếu không nó sẽ báo lỗi và đá người dùng về trang chủ.
- **Tải dữ liệu**:
  - Gọi `getMyResultHistory()` để tìm đúng bài làm (`session`) có `sessionId` tương ứng.
  - Gọi `getExamByCode(..., 'practice')` để lấy toàn bộ dữ liệu đề gốc (bao gồm cả đáp án và lời giải).
  - Khởi tạo `questionsMap`: Bóc tách toàn bộ câu hỏi của phần Listening và Reading từ `examData` nhét vào một Hash Map (Object) để truy xuất cho nhanh ở khâu render.
- **Render UI**:
  - Giao diện Header: Hiện tên bài thi và điểm Overall to, rõ ràng.
  - Vòng lặp duyệt qua 5 kỹ năng (`SKILL_ORDER`). Tùy vào việc kỹ năng đó đã được thi hay chưa (`sessionData.skills[skillKey]`), nó gọi ra 1 trong 2 Component phụ:
    - **`UnattemptedSkillCard`**: Hiển thị khi người dùng chưa làm kỹ năng này (có nút "Start ...").
    - **`AttemptedSkillCard`**: Hiển thị kết quả của kỹ năng đã làm.
- **Chi tiết `AttemptedSkillCard`**:
  - Nếu là Writing/Speaking (isSubjective): Hiển thị trạng thái "Pending" (chờ chấm) hoặc "Graded" kèm Band Score.
  - Nếu là Listening/Reading: 
    - Tính toán số câu đúng (`correctCount`), sai (`wrongCount`), bỏ qua (`skippedCount`) bằng cách so sánh chuỗi `userAns === q.correctAnswer`.
    - Tính phần trăm (`percentage`) để vẽ một vòng tròn tỷ lệ phần trăm (Circular Ring) đẹp mắt bằng biến CSS `--percentage`.
    - Cung cấp nút "View Answer Key" (Toggle Expand). Bấm vào sẽ sổ ra danh sách chi tiết từng câu, highlight màu xanh cho câu đúng, màu đỏ cho câu sai, và in ra lời giải thích (Explanation).

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Component này được gắn vào Route `/result`.
- Được điều hướng (redirect) trực tiếp tới bởi hàm `handleSubmit` bên trong `ExamRoom.jsx`.

## Diem dang chu y (neu co)
- Đây là một Component cực kỳ phức tạp và dài (hơn 300 dòng), nhưng nhờ việc tách thành các Sub-Component (`UnattemptedSkillCard`, `AttemptedSkillCard`) nằm ngay trong cùng một file, mã nguồn vẫn giữ được tính dễ đọc.
- Giao diện vẽ đồ thị vòng tròn (Circular Ring) dùng inline CSS Variable (`style={{"--percentage": ...}}`) là một kỹ thuật CSS hiện đại và rất hay, giúp không phải chèn các thư viện biểu đồ nặng nề (như Chart.js) mà vẫn có đồ thị đẹp.

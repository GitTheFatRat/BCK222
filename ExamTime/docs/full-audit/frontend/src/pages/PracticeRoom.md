# frontend/src/pages/PracticeRoom.jsx

## Muc dich (1-2 cau)
File này định nghĩa giao diện Phòng Luyện tập (Practice Room). Khác với ExamRoom (thi thật tính giờ), phòng luyện tập cho phép người dùng tự do làm bài không có áp lực thời gian, không theo dõi gian lận, không tự động nộp bài và đặc biệt là **hiển thị đáp án ngay lập tức**.

## Import / phu thuoc
- `useEffect`, `useState` từ `react`.
- `useParams`, `Link` từ `react-router-dom`.
- Các Components giao diện kỹ năng: `ListeningForm`, `ReadingSplit`, `WritingEditor`, `SpeakingRecorder`.
- Dịch vụ gọi API: `getExamByCode` từ `examService.js`.

## Noi dung chi tiet
- Component lấy `examId` và `skill` từ URL.
- **Tải Đề Thi**: Khác với `ExamRoom`, file này gọi API `getExamByCode(examId, 'practice')`. Việc truyền tham số `'practice'` sẽ báo cho Backend biết không được che giấu trường `correctAnswer` và `explanation`.
- **Render UI**:
  - Nhìn chung, cấu trúc render rất giống với `ExamRoom`. Tùy vào biến `skill` mà nó gọi ra Component tương ứng.
  - Sự khác biệt lớn nhất là: **Gắn cờ `showAnswers={true}`**. Ví dụ: `<ListeningForm ... showAnswers />` hoặc `<ReadingSplit ... showAnswers />`. Việc này sẽ kích hoạt tính năng tự động bôi đỏ/xanh câu trả lời và hiện lời giải thích ở bên trong các Component con.
  - Không có Component `CountdownTimer` (đồng hồ đếm ngược).
  - Thẻ Audio trong phần Listening được bật thuộc tính `controls` bình thường, cho phép thí sinh tự do tua nhanh/chậm hoặc nghe đi nghe lại thoải mái (không bị khóa tua như bên `ExamRoom`).

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Component này được gắn vào Route `/practice/:examId/:skill`.

## Diem dang chu y (neu co)
- Đây là một phiên bản "rút gọn" và "dễ thở" của `ExamRoom.jsx`. Tính năng này rất tốt cho những học viên mới làm quen với đề thi, cần luyện tập kỹ năng từ từ thay vì bị ép tiến độ.
- Component đang bị lặp lại (duplicate) một số đoạn logic với `ExamRoom.jsx` (ví dụ logic map mảng sections/passages để render). Nếu sau này dự án lớn lên, có thể cân nhắc gộp chung vào một Component `ExamLayout` và truyền prop `isPracticeMode` để quản lý.

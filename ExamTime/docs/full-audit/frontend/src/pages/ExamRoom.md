# frontend/src/pages/ExamRoom.jsx

## Muc dich (1-2 cau)
File này là trung tâm của toàn bộ ứng dụng (The core engine). Nó định nghĩa trang Phòng Thi, nơi người dùng trải qua các bài kiểm tra thực sự dưới áp lực thời gian. Component này quản lý vòng đời của một phiên thi (Session), bao gồm việc tải đề, đếm giờ, lưu điểm tạm thời, bắt gian lận (chuyển tab), và cuối cùng là đóng gói toàn bộ dữ liệu gửi về Backend.

## Import / phu thuoc
- **React**: `useEffect`, `useState`, `useCallback`, `useRef`.
- **Router**: `useParams`, `useNavigate` (để lấy mã đề và chuyển hướng sau khi thi xong).
- **Redux**: Các action từ `examSessionSlice.js` (để đếm giờ và quản lý trạng thái IN_PROGRESS) và `answerSlice.js` (để lấy bài làm của học sinh).
- **Components**: `CountdownTimer`, `Sidebar`, `AudioPlayer`, và 4 giao diện tương ứng với 4 kỹ năng (`ListeningForm`, `ReadingSplit`, `WritingEditor`, `SpeakingRecorder`).
- **Services**: `getExamByCode`, `submitExam`.

## Noi dung chi tiet
- Component đọc `examId` (mã đề) và `skill` (kỹ năng) từ URL. 
- **Quản lý Session (LocalStorage)**: Khi user bắt đầu làm bài, nó tạo một `sessionId` duy nhất bằng `crypto.randomUUID()` và lưu vào LocalStorage (có hiệu lực 30 ngày). Việc này giúp Backend nhóm các bài làm Listening, Reading... lẻ tẻ của cùng một người thành một bài thi tổng thể duy nhất.
- **Tải Đề Thi**: Dùng `getExamByCode(examCode, 'exam')`. Mode 'exam' sẽ bảo Backend xóa sạch các trường `correctAnswer` và `explanation` trước khi trả về, tránh trường hợp học sinh F12 để gian lận xem đáp án. Sau khi tải xong, nó báo cho Redux khởi động đồng hồ đếm ngược (`startSession`).
- **Phát hiện gian lận**: `document.addEventListener('visibilitychange')`. Nếu user chuyển sang tab khác để tra từ điển, nó gửi action `logCheatingEvent` vào Redux.
- **Nộp Bài (`handleSubmit`)**:
  - Ngăn chặn nộp bài 2 lần bằng `hasSubmittedRef`.
  - Nếu kỹ năng là Speaking, nó phải biến đổi cái URL Blob tạm thời (audio ghi âm) thành một đối tượng Blob thực sự thông qua hàm `fetch()`.
  - Tổng hợp mọi dữ liệu (answers, cheatingLog, bài luận, âm thanh) truyền cho API `submitExam`.
  - Sau khi nộp thành công, đóng gói kết quả truyền (qua thuộc tính `state` của React Router) sang trang `/result`, đồng thời gọi Redux `resetAnswers()` dọn dẹp sạch sẽ để nhường chỗ cho kỹ năng tiếp theo.
- **Tự động nộp**: Theo dõi biến `status` của Redux. Nếu đồng hồ chỉ `0`, Redux đổi status thành `SUBMITTED`, useEffect sẽ tự động gọi hàm `handleSubmit` thay mặt user.
- **Render UI**:
  - Dựa vào tham số `skill` trên URL, render ra khối Component tương ứng (`ListeningForm`, `ReadingSplit`, `WritingEditor`, `SpeakingRecorder`).
  - Gắn thanh `Sidebar` để người dùng có thể nhấp chuột nhảy nhanh tới câu hỏi tương ứng (áp dụng cho Listening/Reading).

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Được mount vào Route `/exam/:examId/:skill`.

## Diem dang chu y (neu co)
- File này chứa tới 315 dòng code với rất nhiều useEffect chồng chéo. Tuy nhiên, luồng logic được phân bổ khá rành mạch (Khởi tạo -> Tải đề -> Giám sát gian lận -> Nộp bài -> Hiển thị).
- **Cơ chế chống spam nộp bài**: Việc kết hợp state `isSubmitting` và `useRef` `hasSubmittedRef` rất thông minh, giúp chặn được cả trường hợp user spam click chuột lẫn trường hợp user vừa click thì vừa hết giờ (2 hàm nộp bài đua nhau chạy cùng lúc).

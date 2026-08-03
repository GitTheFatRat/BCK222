# frontend/src/pages/AdminDashboard.jsx

## Muc dich (1-2 cau)
File này đóng vai trò là Bảng điều khiển (Dashboard) chính của Quản trị viên (Giáo viên). Chức năng chính của nó là hiển thị danh sách các bài thi tự luận (Writing và Speaking) đang chờ chấm điểm (Pending), cho phép giáo viên đọc bài/nghe ghi âm và nhập điểm số trực tiếp.

## Import / phu thuoc
- `useState`, `useEffect`, `useCallback` từ `react`.
- `getPendingResults`, `submitGrade` từ `../services/resultService.js`: API lấy bài thi chờ và gửi điểm lên server.

## Noi dung chi tiet
- **State Quản lý**:
  - `pending`: Mảng chứa danh sách bài thi đang chờ chấm.
  - `expandedId`: Quản lý việc Đóng/Mở (Accordion) chi tiết của một bài thi.
  - `gradeInputs`: Một object lưu điểm số (từ 0-9) mà giáo viên đang gõ vào ô input, tương ứng với từng `task._id`.
  - `gradingStatus`: Quản lý trạng thái UI của nút Submit (Loading, Success, Error).
- **Logic lấy dữ liệu**: Dùng `useEffect` và `loadPending` để nạp danh sách ngay khi mở trang.
- **Logic Chấm điểm (`handleSubmitGrade`)**:
  - Lấy điểm số từ `gradeInputs[id]`. Validate để đảm bảo điểm nằm trong khoảng 0 đến 9.
  - Gọi API `submitGrade(id, score)`.
  - Nếu thành công, hiển thị chữ "Graded successfully!", sau đó delay 1.2 giây (`setTimeout(..., 1200)`) trước khi xóa hẳn bài thi đó khỏi mảng `pending` (tạo hiệu ứng chuyển tiếp mượt mà cho người dùng).
- **Phần Render (UI)**:
  - Nếu `pending.length === 0`: Hiện giao diện báo cáo đã chấm xong hết (All caught up!).
  - Trái lại, duyệt mảng `pending` và render các khối `.admin-task-card`.
  - Khối Header: Hiển thị tag kỹ năng (VD: "Writing Task 1"), tên sinh viên, tên bài thi và thời gian nộp.
  - Khối Body (khi bấm Expand):
    - Nếu là `writing-task1` hoặc `writing-task2`: Hiển thị văn bản bài luận (`task.writingTask...Text`) và kèm theo số từ (Word count) để giáo viên dễ đánh giá độ dài.
    - Nếu là `speaking`: Hiển thị thẻ `<audio controls>` để giáo viên bấm nghe lại file âm thanh gốc. Đường dẫn lấy từ `BACKEND_URL` + `task.speakingRecordingUrl`.
    - Dưới cùng là Form nhập điểm: Gồm một thẻ `input type="number"` bước nhảy (step) 0.5 và nút "Submit Grade".

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Component này được gắn vào Route `/admin/grading` và bọc bởi `<AdminRoute>`.

## Diem dang chu y (neu co)
- Component này tái sử dụng lại CSS class `status-badge` và `admin-task-card` được định nghĩa trong file `components.css`.
- Cách tính số từ (Word count) của Writing trong file này (`task.writing...Text.trim().split(/\s+/).filter(Boolean).length`) rất chặt chẽ vì có thêm `.filter(Boolean)` giúp loại bỏ các khoảng trắng thừa bị dư ra. Logic này tốt hơn so với logic đếm từ ở trang `WritingEditor.jsx` của học sinh.

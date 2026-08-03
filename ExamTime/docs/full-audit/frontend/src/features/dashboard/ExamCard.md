# frontend/src/features/dashboard/ExamCard.jsx

## Muc dich (1-2 cau)
File này định nghĩa component thẻ hiển thị bài thi (Exam Card) trên trang chủ (Dashboard). Nó hiển thị tiêu đề bài thi, trạng thái hoàn thành (kèm band điểm nếu có), và các nút để thí sinh bắt đầu hoặc làm lại bài thi.

## Import / phu thuoc
- `Link` từ `react-router-dom`: Để tạo liên kết chuyển trang đến phòng thi.

## Noi dung chi tiet
- Component nhận prop `exam` (một object chứa thông tin bài thi như `title`, `examId`, `isCompleted`, `bestBand`).
- Hằng số `SKILLS` (mảng các kỹ năng): Đang bị bỏ xó (unused variable). Trước đây có thể được dùng để tạo các nút thi lẻ từng kỹ năng nhưng hiện tại đoạn UI đó đã bị gỡ bỏ.
- **Render**:
  - Giao diện thẻ (`.exam-card`).
  - `.exam-card-header`: Hiển thị tiêu đề bài thi. Bên cạnh là một badge (nhãn) để báo hiệu bài này đã thi xong chưa (`Completed - Band ...` hoặc `Not Yet`).
  - `.exam-card-footer`: Chứa 2 nút bấm.
    - Nút `Start a new attempt` (Nút phụ): Khi bấm vào, nó sẽ xóa sạch dữ liệu phiên thi cũ lưu trong `localStorage` với key `examtime_session_${exam.examId}` và hiển thị cảnh báo (alert).
    - Nút `Take Exam` (Nút chính): Một thẻ `Link` chuyển hướng người dùng thẳng tới trang `/exam/:id/listening` (do đặc thù bài thi IELTS luôn bắt đầu bằng kỹ năng Listening trước).

## Duoc su dung boi (dependents)
- `frontend/src/pages/HomeDashboard.jsx`: Dùng để duyệt (map) qua mảng bài thi trả về từ API và render ra danh sách các thẻ bài thi.

## Diem dang chu y (neu co)
- **Hardcode luồng thi**: Việc link `Take Exam` trỏ thẳng tới nhánh `/listening` phản ánh đúng luồng thi IELTS (Listening -> Reading -> Writing).
- Đoạn code inline style (như `style={{ marginTop: '1.5rem', display: 'flex' }}`) nên được đưa ra file `components.css` để dễ quản lý.
- Mảng `SKILLS` bị thừa, có thể xóa đi để code sạch hơn.

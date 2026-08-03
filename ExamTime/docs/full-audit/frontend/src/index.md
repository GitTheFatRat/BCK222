# frontend/src/index.css

## Muc dich (1-2 cau)
File này định nghĩa toàn bộ CSS toàn cục (Global CSS) cho ứng dụng ExamTime. Khác với `components.css` (chứa style chi tiết cho từng nút, thẻ), file này quy định bộ khung nền tảng: màu sắc chủ đạo (CSS Variables), reset margin/padding, font chữ, bố cục Layout chính (App Shell), và style cho các trang lớn (Pages) như Login, Register, Home Dashboard, Exam Room, v.v.

## Import / phu thuoc
- Không import file CSS khác, nhưng nó dựa vào font chữ `Inter` (đã được nạp sẵn qua Google Fonts trong `index.html`).

## Noi dung chi tiet
- **CSS Variables & Reset**: Định nghĩa biến màu sắc (`--et-bg`, `--et-text`, `--et-navy`) và reset box-sizing, font mặc định cho toàn bộ thẻ `body`.
- **Layout & Typography**: Định dạng `.app-shell`, `.app-content` và xử lý căn lề, màu sắc mặc định cho các thẻ Heading (`h1`->`h6`), thẻ Link (`a`).
- **Nút bấm (Buttons) và Forms**: Định dạng giao diện chuẩn cho `.btn-primary`, `.btn-secondary`, `.btn-danger` cùng với các hiệu ứng hover, shadow. Định dạng toàn cục cho các trường nhập liệu (`input`, `label`).
- **Style cho các Trang (Pages)**:
  - `.login-page`, `.register-page`: Giao diện form đặt giữa màn hình.
  - `.dashboard-container`, `.exams-grid`: Giao diện lưới cho trang chủ của học viên.
  - `.exam-room`, `.exam-room-header`, `.exam-room-body`: Khung cảnh chia layout 2 cột lúc thi.
  - `.practice-room`: Gần giống `exam-room`.
  - `.result-summary-page`: Giao diện tổng kết điểm. Đáng chú ý là khối `.skill-stats-layout` và `.circular-ring` dùng CSS Variables `--percentage` để vẽ vòng tròn tỷ lệ đúng sai.
  - `.admin-dashboard`, `.admin-task-card`: Giao diện danh sách bài thi chờ chấm của giáo viên.

## Duoc su dung boi (dependents)
- `frontend/src/main.jsx`: Được import ở cấp độ cao nhất (`import './index.css'`).

## Diem dang chu y (neu co)
- **Quá dài và ôm đồm**: File này dài tới hơn 1400 dòng, chứa style của tất cả các trang. Trong một dự án React hiện đại, cách làm này dẫn đến khó bảo trì và dễ gây xung đột (CSS Conflict).
- **Hướng cải thiện (Refactoring)**:
  - Chỉ nên giữ lại các biến màu sắc (Variables), Reset, và Typography cơ bản ở file này.
  - Tách style của từng trang ra các file riêng (ví dụ: `Login.css`, `ExamRoom.css`) và import chúng trực tiếp vào các Component `.jsx` tương ứng, hoặc sử dụng CSS Modules (`Login.module.css`).
  - Nếu muốn triệt để hơn, có thể cân nhắc chuyển sang sử dụng Tailwind CSS để loại bỏ hoàn toàn việc phải viết tay và quản lý hàng nghìn dòng CSS như thế này.

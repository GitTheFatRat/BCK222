# frontend/src/components/Layout/Sidebar.jsx

## Muc dich (1-2 cau)
File này định nghĩa giao diện bảng điều hướng (Question Palette) nằm ở bên phải của trang Phòng thi (ExamRoom). Nó hiển thị danh sách các ô số (tương ứng với số thứ tự câu hỏi), cho phép người dùng click để nhảy tới câu hỏi tương ứng và hiển thị màu sắc để báo hiệu câu nào đã làm, câu nào chưa.

## Import / phu thuoc
(Không phụ thuộc vào bất kỳ thư viện bên ngoài hay state management nào. Nhận dữ liệu hoàn toàn qua props).

## Noi dung chi tiet
- Component nhận 3 tham số (props) từ component cha:
  - `totalQuestions`: Tổng số câu hỏi của bài thi (ví dụ: 40).
  - `answeredIds`: Một mảng chứa danh sách các ID của câu hỏi mà thí sinh đã trả lời (ví dụ: `['Q1', 'Q2']`).
  - `onJump`: Hàm callback để xử lý sự kiện khi thí sinh click vào một ô số.
- Khởi tạo mảng `questionNumbers` từ `1` đến `totalQuestions` (ví dụ `[1, 2, ..., 40]`).
- Vòng lặp `.map`: Sinh ra các thẻ `<button>` tương ứng với mỗi số.
  - Logic tô màu: Kiểm tra xem ID của câu hỏi (ví dụ `Q1`) có nằm trong mảng `answeredIds` hay không. Nếu có, thêm class `sidebar__question-btn--answered` (được CSS định nghĩa là có nền màu xanh).
  - Khi click, gọi hàm `onJump(qId)` truyền mã câu lên cho component cha (`ExamRoom`) xử lý việc cuộn chuột (scroll).
- Phần hiển thị Legend (chú thích) ở dưới cùng: Hiển thị 2 chấm tròn để giải thích ý nghĩa màu sắc (Đã làm / Chưa làm).

## Duoc su dung boi (dependents)
- `frontend/src/pages/ExamRoom.jsx`: Import trực tiếp và sử dụng để hiển thị thanh điều hướng bài thi.

## Diem dang chu y (neu co)
- **Tên Component Gây Nhầm Lẫn**: Khác với `AppSidebar.jsx` chuyên về điều hướng các trang, `Sidebar.jsx` này chuyên môn hóa cho việc hiển thị Palette câu hỏi. Việc đặt tên chung chung là "Sidebar" rất dễ gây xung đột khái niệm.
- Component này là một "Dumb Component" (Component ngu) hoàn hảo: Không tự ý truy cập Redux, không tự ý quản lý state bên trong. Mọi thứ được định đoạt bởi component cha, giúp nó cực kỳ dễ test và tái sử dụng.

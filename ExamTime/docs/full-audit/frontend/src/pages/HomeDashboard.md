# frontend/src/pages/HomeDashboard.jsx

## Muc dich (1-2 cau)
File này đóng vai trò là Trang Chủ (Home Dashboard) dành cho Học viên sau khi họ đăng nhập thành công. Trang này hiển thị danh sách tất cả các bài thi có sẵn trên hệ thống (để học viên có thể bấm vào làm) và một bảng tổng kết lịch sử những bài thi họ đã từng làm trước đây.

## Import / phu thuoc
- `useEffect`, `useState` từ `react`.
- Components: `ExamCard`, `ResultHistory` từ thư mục `features/dashboard`.
- Services: `getExam` (để lấy danh sách đề thi), `getMyResultHistory` (để lấy lịch sử thi của cá nhân).

## Noi dung chi tiet
- State:
  - `exams`: Mảng danh sách bài thi hiển thị trên các thẻ (Cards).
  - `results`: Mảng chứa lịch sử thi.
  - `isLoading`, `error`: Quản lý trạng thái tải dữ liệu.
- `useEffect`: Chạy hàm `loadDashboardData` một lần duy nhất khi vừa vào trang.
  - Sử dụng `Promise.all` để gọi đồng thời 2 API (`getExam` và `getMyResultHistory`), giúp giảm thiểu thời gian chờ (latency) so với việc gọi tuần tự từng cái.
  - Sau khi có dữ liệu, thực hiện việc **mapping (trộn dữ liệu)**: Duyệt qua danh sách `examList`, đối chiếu (find) với mảng `history` xem bài thi đó người dùng đã làm chưa. Nếu có làm rồi, nó trích xuất ra điểm `bestBand` và set cờ `isCompleted = true`. Điều này giúp `ExamCard` biết để hiển thị Badge "Completed".
- **Render (UI)**:
  - Chia làm 2 phần rõ rệt:
    - **IELTS Exam Practice**: Dùng `.map` duyệt mảng `exams` sinh ra các `ExamCard` dạng Grid.
    - **Result History**: Truyền mảng `results` vào component `ResultHistory` để vẽ thành cái bảng chi tiết bên dưới.

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Component này là trang gốc của học viên, được mount vào Route `/` (route bảo mật, chỉ truy cập được khi đã đăng nhập).

## Diem dang chu y (neu co)
- **Hiệu năng**: Cú pháp `Promise.all([getExam(), getMyResultHistory()])` là một điểm cộng rất lớn về mặt tối ưu hiệu năng gọi API. 
- **Lỗi nhỏ về logic đối chiếu**: Hiện tại, code đang dùng `r.examTitle === exam.title` để đối chiếu xem bài thi đã làm chưa. Sẽ an toàn và chuẩn xác hơn nếu đối chiếu bằng ID (`r.examId === exam.code` hoặc tương tự), bởi vì tiêu đề (title) có thể bị sửa đổi hoặc trùng lặp trong tương lai.

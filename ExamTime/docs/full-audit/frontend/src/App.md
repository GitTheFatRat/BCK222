# frontend/src/App.jsx

## Muc dich (1-2 cau)
File này là Component gốc thứ hai (chỉ đứng sau `main.jsx`) của toàn bộ ứng dụng Frontend. Nó định nghĩa Layout tổng thể (Sidebar bên trái, nội dung ở giữa, Footer bên dưới) và cấu hình toàn bộ hệ thống định tuyến (Routing) của React Router, quyết định đường dẫn URL nào sẽ mở ra Trang (Page) nào.

## Import / phu thuoc
- `Routes, Route, Navigate` từ `react-router-dom`: Để khai báo các tuyến đường.
- `useSelector` từ `react-redux`: Để lấy thông tin `isAuthenticated` (kiểm tra user đã đăng nhập chưa).
- Import hầu như toàn bộ các Component Layout (`AppSidebar`, `Footer`, `RouteGuard`, `AdminRoute`) và các Pages (`Login`, `Register`, `HomeDashboard`, `PracticeRoom`, `ExamRoom`, `ResultSummary`, `AdminDashboard`, `AdminCheatingLogs`).

## Noi dung chi tiet
- **Các Component bảo vệ (Guards)**:
  - `LoginReturnHome`: Nếu user **đã đăng nhập** mà cố tình gõ URL `/login` hoặc `/register`, nó sẽ dùng thẻ `<Navigate to="/">` để đẩy user về lại trang chủ. (Không ai đăng nhập rồi lại đi đăng nhập tiếp).
  - `ForceAuth`: Nếu user **chưa đăng nhập** mà cố tình truy cập vào các trang bảo mật (như `/exam`, `/practice`), nó sẽ đẩy user ra màn hình `/login`.
  - `NotFound`: Giao diện hiển thị lỗi 404 nếu user gõ URL không tồn tại (như `/abcxyz`).
- **Component App (Main Layout)**:
  - Bao bọc toàn bộ ứng dụng trong cấu trúc `div.app-shell.layout-sidebar`. Điều này thiết lập bộ khung giao diện: thanh menu `AppSidebar` luôn nằm bên trái, và nội dung chính nằm trong `<main className="app-content">`.
  - Khối `<Routes>` định nghĩa danh sách đường dẫn:
    - `/login`, `/register`: Bọc bởi `LoginReturnHome`.
    - `/`, `/practice/:examId/:skill`, `/result`: Bọc bởi `ForceAuth`.
    - `/exam/:examId/:skill`: Bọc bởi 2 lớp bảo vệ là `ForceAuth` và `RouteGuard` (để chặn F5 khi đang thi).
    - `/admin/grading`, `/admin/cheating-logs`: Bọc bởi 2 lớp là `ForceAuth` và `AdminRoute` (để chặn học sinh lẻn vào trang của giáo viên).
    - `*`: Bọc bởi `NotFound` (Bắt mọi đường dẫn sai).

## Duoc su dung boi (dependents)
- `frontend/src/main.jsx`: Component cấp cao nhất dùng `<BrowserRouter>` bọc lấy `<App />` và gắn (mount) nó vào thẻ `div#root` của HTML.

## Diem dang chu y (neu co)
- Cấu trúc thư mục (Layout Architecture) ở đây được làm rất chuẩn mực. Thay vì mỗi trang (Page) phải tự import và vẽ lại Sidebar, Sidebar được đặt cố định một lần duy nhất ở cấp độ `App`.
- Các Route Guards (`LoginReturnHome`, `ForceAuth`) được viết ngay trong file này dưới dạng các function component tĩnh (inline components). Dù hiện tại code vẫn gọn, nhưng nếu sau này có thêm nhiều logic phức tạp, có thể tách chúng ra một thư mục `frontend/src/guards/` riêng biệt để dễ quản lý.

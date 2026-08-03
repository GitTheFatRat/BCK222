# frontend/src/components/Layout/Navbar.jsx

## Muc dich (1-2 cau)
File này từng đóng vai trò là thanh điều hướng chính (Top Navbar) của ứng dụng web, chứa logo trang web, tên người dùng, nút đăng xuất, và các liên kết đặc quyền dành cho Quản trị viên (Admin).

## Import / phu thuoc
- `useDispatch`, `useSelector` từ `react-redux`: Lấy thông tin xác thực (`isAuthenticated`, `user`) và gửi action.
- `Link`, `useNavigate` từ `react-router-dom`: Quản lý chuyển trang (routing) ở client-side.
- `logout` từ `../../store/slices/authSlice.js`: Action xóa state đăng nhập.

## Noi dung chi tiet
- Component `Navbar`:
  - Lấy trạng thái user từ Redux.
  - Hàm `handleLogout`: Gọi `dispatch(logout())` và điều hướng về trang `/login` (sử dụng `replace: true` để người dùng không bấm nút Back quay lại được).
  - Giao diện (Render):
    - Khối logo: Chữ "IELTS ExamTime" được bọc trong thẻ `<Link>` trỏ về trang chủ `/`.
    - Khối người dùng (chỉ hiện khi `isAuthenticated` là true):
      - Nếu `user.role === 'admin'`: Sẽ render thêm 2 liên kết "Grading" và "Cheating Logs".
      - Hiển thị tên đăng nhập hoặc email (`user?.username || user?.email`).
      - Nút Đăng xuất.

## Duoc su dung boi (dependents)
- **Không có (Dead Code)**: Như đã đề cập ở file proxy `Navbar.jsx`, giao diện của dự án đã chuyển sang thiết kế Sidebar. Component này bị loại bỏ khỏi `App.jsx` và hiện không còn được render ở bất kỳ đâu trong ứng dụng.

## Diem dang chu y (neu co)
- Mặc dù là dead code, logic phân quyền (`user?.role === 'admin'`) và logout trong file này đã được bê nguyên xi (copy-paste) sang `AppSidebar.jsx`. Việc giữ lại file này chỉ làm tăng dung lượng bundle và gây nhiễu cho lập trình viên. Nên xóa (delete) file này khỏi hệ thống.

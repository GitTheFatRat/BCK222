# frontend/src/components/AdminRoute.jsx

## Muc dich (1-2 cau)
File này đóng vai trò là một "Người gác cổng" (Route Guard/Wrapper Component) để bảo vệ các trang (Pages) dành riêng cho Quản trị viên (Admin). Nếu người dùng không có quyền truy cập, họ sẽ bị đẩy ra ngoài trang chủ.

## Import / phu thuoc
- `useSelector` từ `react-redux`: Để lấy thông tin user hiện tại từ Redux Store.
- `Navigate` từ `react-router-dom`: Component dùng để chuyển hướng (redirect) trang một cách cưỡng bức.

## Noi dung chi tiet
- Component `AdminRoute` nhận một prop duy nhất là `children` (đại diện cho component con bị bọc bên trong).
- Nó truy cập vào `state.auth.user` thông qua Redux.
- **Kiểm tra quyền**:
  - `if (!user || user.role !== 'admin')`: Nếu người dùng chưa đăng nhập (user là null) hoặc có đăng nhập nhưng `role` (vai trò) không phải là `'admin'`.
  - Trả về thẻ `<Navigate to="/" replace />`: Lập tức chuyển hướng trình duyệt về trang chủ (`/`). Cờ `replace` giúp thay thế luôn lịch sử duyệt web hiện tại, nghĩa là user không thể bấm nút "Back" trên trình duyệt để quay lại trang cấm này.
  - Ngược lại (có quyền admin): Trả về `children` để render bình thường.

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Sử dụng để bọc các route quản trị như `<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />`.

## Diem dang chu y (neu co)
- Đây là biện pháp bảo vệ ở tầng Frontend (Client-side Security). Nó giúp ẩn giao diện đi, nhưng thực tế hacker vẫn có thể xem được mã nguồn trang admin nếu cố tình vọc vạch. Do đó, bảo mật ở Frontend luôn phải đi kèm với bảo mật ở Backend (`adminMiddleware.js` đã được thiết lập bên Express). Hai tầng này kết hợp lại mới tạo ra hệ thống an toàn.

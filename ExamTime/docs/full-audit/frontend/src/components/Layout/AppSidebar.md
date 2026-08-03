# frontend/src/components/Layout/AppSidebar.jsx

## Muc dich (1-2 cau)
File này định nghĩa thanh điều hướng chính của toàn bộ ứng dụng (Global Navigation Sidebar), nằm cố định ở mép trái màn hình. Nó là bản nâng cấp thay thế hoàn toàn cho `Navbar.jsx` cũ, giúp giao diện trông hiện đại và chuyên nghiệp hơn (giống phong cách của các web dashboard như Notion, Jira).

## Import / phu thuoc
- `useDispatch`, `useSelector` từ `react-redux`: Lấy thông tin xác thực (`isAuthenticated`, `user`) và hàm gửi action.
- `Link`, `useNavigate`, `useLocation` từ `react-router-dom`: Quản lý chuyển trang (routing) và lấy đường dẫn URL hiện tại (`useLocation`) để làm nổi bật (highlight) menu đang chọn.
- `logout` từ `../../store/slices/authSlice.js`: Action xóa state đăng nhập.

## Noi dung chi tiet
- Component `AppSidebar`:
  - Lấy trạng thái user và xác thực từ Redux.
  - Hàm `handleLogout`: Gọi Redux xóa token và đẩy user về trang `/login`.
  - Hàm `isActive(path)`: Kiểm tra nếu URL hiện tại (`location.pathname`) trùng với `path` thì trả về chuỗi `'active'`, ngược lại trả về rỗng. Dùng để tô đậm nút menu mà người dùng đang đứng.
  - **Logic Render**:
    - **Trường hợp chưa đăng nhập (!isAuthenticated)**: Chỉ trả về một Sidebar rút gọn, chứa mỗi Logo của trang web (để vẫn giữ được thiết kế 2 cột cho các trang Login/Register).
    - **Trường hợp đã đăng nhập**:
      - Khối Header (trên cùng): Hiển thị Logo.
      - Khối Nav (giữa): Chứa các Menu Link. Luôn có menu "Dashboard". Nếu user có `role === 'admin'`, hiển thị thêm phân hệ (section) Admin gồm "Grading" và "Cheating Logs".
      - Khối Footer (dưới cùng): Hiển thị ảnh đại diện dạng chữ cái (Avatar), Tên người dùng và nút Đăng xuất.

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Được gắn ở cấp độ cao nhất của ứng dụng, bọc bên ngoài thẻ `<Routes>` để nó luôn hiện diện trên mọi trang (trừ những trang cố tình ẩn nó đi bằng CSS).

## Diem dang chu y (neu co)
- **Cải tiến UI/UX**: Component này được tạo ra từ yêu cầu *"giao diện bây giờ hơi bị tiết kiệm hai bên trái và phải, chúng ta có thể đập đi xây lại ko, làm cái sidebar cx dc"* của người dùng ở phiên làm việc (session) trước. Việc sử dụng `useLocation` để gán class `active` là một "best practice" rất tốt để nâng cao trải nghiệm người dùng, giúp họ biết mình đang ở đâu.

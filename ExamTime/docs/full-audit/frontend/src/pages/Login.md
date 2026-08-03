# frontend/src/pages/Login.jsx

## Muc dich (1-2 cau)
File này định nghĩa trang Đăng nhập (Login) của ứng dụng. Nó cung cấp form nhập email, mật khẩu và xử lý logic gọi API để xác thực người dùng.

## Import / phu thuoc
- `useState` từ `react`.
- `useDispatch` từ `react-redux`.
- `useNavigate`, `useLocation`, `Link` từ `react-router-dom`: Quản lý điều hướng.
- `loginSuccess` từ `../store/slices/authSlice.js`: Action cập nhật state đăng nhập thành công vào Redux.
- `login` từ `../services/authService.js`: Hàm gọi API POST tới `/api/auth/login`.

## Noi dung chi tiet
- Component quản lý các state: `form` (chứa email và password), `error` (hiển thị thông báo lỗi), và `isSubmitting` (để vô hiệu hóa nút bấm tránh double-submit).
- Lấy `redirectTo` từ `location.state?.from`: Khi người dùng chưa đăng nhập mà cố gắng truy cập vào một trang yêu cầu bảo mật (ví dụ `/exam/123`), React Router sẽ đá họ văng ra trang `/login` nhưng vẫn ngầm lưu lại cái đích đến ban đầu `/exam/123` vào `location.state.from`. Nhờ đó, sau khi đăng nhập thành công, hệ thống biết đường trả họ về đúng chỗ cũ thay vì lúc nào cũng đẩy về trang chủ (`/`).
- `handleSubmit(e)`: Hàm xử lý sự kiện submit form.
  - Ngăn chặn hành vi reset trang mặc định (`e.preventDefault()`).
  - Kiểm tra tính đầy đủ của email và password.
  - Đặt `isSubmitting = true`.
  - Gọi API `login(form)`.
  - Thành công: Gửi action `loginSuccess` chứa data (user info + token) lên Redux, và điều hướng tới `redirectTo`.
  - Thất bại: Lấy thông báo lỗi từ phía server (`error.response.data.message`) hoặc báo lỗi mặc định, sau đó in ra giao diện.
- **Render UI**: Một form cơ bản bọc trong class `.login-page` (theo layout 2 cột đã được định nghĩa trong CSS). Dưới cùng có thêm link chuyển sang trang Register (Đăng ký) nếu chưa có tài khoản.

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Component này được mount vào Route `/login`.

## Diem dang chu y (neu co)
- Cơ chế ghi nhớ `location.state?.from` là một UX Pattern (mẫu thiết kế trải nghiệm người dùng) rất chuyên nghiệp. Nó giúp luồng thao tác của người dùng không bị đứt gãy.
- Form sử dụng các thuộc tính `autoComplete="email"` và `autoComplete="current-password"`, giúp trình duyệt web (như Chrome) dễ dàng đề xuất và tự động điền mật khẩu đã lưu cho người dùng.

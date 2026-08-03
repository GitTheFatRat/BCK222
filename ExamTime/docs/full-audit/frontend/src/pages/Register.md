# frontend/src/pages/Register.jsx

## Muc dich (1-2 cau)
File này định nghĩa trang Đăng ký tài khoản mới. Nó thu thập thông tin (Username, Email, Password) từ người dùng, kiểm tra tính hợp lệ cơ bản của dữ liệu (validate) rồi gửi yêu cầu lên Backend.

## Import / phu thuoc
- `useState` từ `react`.
- `useNavigate`, `Link` từ `react-router-dom`.
- `register` từ `../services/authService.js`: Hàm gọi API POST tới `/api/auth/register`.

## Noi dung chi tiet
- State: `form` (chứa 4 trường: username, email, password, confirmPassword), `error`, `isSubmitting`.
- Hàm `validate()`: Thực hiện kiểm tra tính hợp lệ của dữ liệu trước khi gửi đi:
  - Tất cả các trường không được để trống.
  - Mật khẩu phải có ít nhất 6 ký tự.
  - Mật khẩu (`password`) và Nhập lại mật khẩu (`confirmPassword`) phải khớp nhau hoàn toàn.
- Hàm `handleSubmit(e)`:
  - Dừng submit mặc định của form.
  - Chạy `validate()`. Nếu có lỗi, hiện thông báo lỗi và dừng lại (không gọi API).
  - Đặt `isSubmitting = true`.
  - Gọi API `register()`. Do Backend yêu cầu dữ liệu gửi lên chỉ gồm 3 trường, ta lọc bỏ trường `confirmPassword` đi và chỉ gửi `username, email, password`.
  - Đăng ký thành công: Chuyển hướng người dùng sang trang `/login` (bằng `navigate('/login')`) để họ tự đăng nhập lại. (Lưu ý: Một số hệ thống hiện đại sẽ tự động login luôn sau khi register, nhưng hệ thống này yêu cầu login lại để đảm bảo luồng bảo mật).
  - Thất bại: In ra thông báo lỗi từ phía server (ví dụ: "Email đã tồn tại").
- **Render UI**: Một form nhập liệu bao gồm 4 ô input, tương tự như trang Login.

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Component này được mount vào Route `/register`.

## Diem dang chu y (neu co)
- **Bảo mật Frontend**: Việc validate độ dài mật khẩu (>= 6) và khớp mật khẩu ở phía Frontend giúp giảm tải số lượng request lỗi không cần thiết đẩy lên Backend, đồng thời đem lại phản hồi (feedback) tức thì cho người dùng.
- Form có sử dụng `autoComplete="new-password"` cho các ô nhập mật khẩu. Đây là chỉ thị giúp trình duyệt web hoặc các trình quản lý mật khẩu (Password Manager) hiểu rằng đây là thao tác tạo mật khẩu mới, từ đó chúng sẽ gợi ý (suggest) các mật khẩu siêu mạnh cho người dùng.

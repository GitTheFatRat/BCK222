# frontend/src/services/authService.js

## Muc dich (1-2 cau)
File này là một lớp dịch vụ (Service Layer) đóng gói tất cả các lời gọi API liên quan đến xác thực người dùng (đăng nhập, đăng ký, lấy thông tin cá nhân). Nó giúp tách biệt logic giao tiếp mạng (HTTP requests) ra khỏi các UI Component, giúp code gọn gàng và dễ tái sử dụng hơn.

## Import / phu thuoc
- `apiClient` từ `../config/axios.js`: Một instance của axios đã được cấu hình sẵn base URL (ví dụ: `http://localhost:5000/api`) và tự động đính kèm Token vào Header.

## Noi dung chi tiet
Cung cấp 3 hàm bất đồng bộ (async functions):
- **`login(credentials)`**: Gửi POST request tới `/auth/login` kèm theo email và password. Trả về data (gồm token và thông tin user).
- **`register(payload)`**: Gửi POST request tới `/auth/register` kèm theo thông tin đăng ký (name, email, password...).
- **`getCurrentUser()`**: Gửi GET request tới `/auth/me` để lấy thông tin của user hiện tại đang đăng nhập. Mặc dù hàm này không nhận tham số nào, `apiClient` sẽ tự động nhét token vào Header `Authorization: Bearer <token>` để backend xác thực.

## Duoc su dung boi (dependents)
- `frontend/src/pages/Login.jsx`: Gọi hàm `login` khi user ấn nút Submit form.
- `frontend/src/pages/Register.jsx`: Gọi hàm `register`.
- (Có thể được dùng ở các component khác nếu cần lấy lại profile từ server).

## Diem dang chu y (neu co)
- **Tối giản**: Các hàm service này viết theo chuẩn destructuring của axios (`const { data } = ...; return data;`). Nhờ vậy, ở phía các Component React, lập trình viên chỉ cần gọi `const res = await login(...)` và nhận trực tiếp dữ liệu thay vì phải `.then(res => res.data)`.
- Các hàm này không có khối `try...catch` nội bộ. Toàn bộ lỗi (như sai mật khẩu, server sập) sẽ được "ném" (throw) ngược lại cho Component gọi nó xử lý. Đây là một pattern tốt giúp UI chủ động hiển thị thông báo lỗi phù hợp.

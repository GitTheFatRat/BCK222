# frontend/src/config/axios.js

## Muc dich (1-2 cau)
File này cấu hình thư viện `axios` (một HTTP Client phổ biến) để tạo ra một `apiClient` dùng chung cho toàn bộ dự án Frontend. Nó xử lý tự động việc đính kèm Token bảo mật vào mọi request và tự động đăng xuất người dùng nếu Token hết hạn.

## Import / phu thuoc
- `axios`.
- `store` từ `../store/index.js`: Lấy trực tiếp kho chứa Redux ra để đọc token hoặc gửi lệnh (dispatch).
- `logout` từ `../store/slices/authSlice.js`: Action đăng xuất.

## Noi dung chi tiet
- **Khởi tạo `apiClient`**: 
  - Đọc `VITE_API_BASE_URL` từ biến môi trường (mặc định fallback về `http://localhost:5000/api`).
  - Timeout là 15 giây.
- **Request Interceptor (Tiền xử lý trước khi gửi)**:
  - Trước khi bất kỳ một request nào được bay đi, nó sẽ chui qua hàm này.
  - Lấy `token` từ Redux bằng `store.getState().auth.token`.
  - Nếu có token, tự động gắn vào Header: `Authorization: Bearer <token>`.
- **Response Interceptor (Hậu xử lý khi nhận kết quả)**:
  - Nếu kết quả trả về bị lỗi (nhảy vào khối error), nó kiểm tra HTTP Status Code.
  - Nếu `status === 401` (Unauthorized - Token hết hạn hoặc không hợp lệ):
    - Nó tự động gọi `store.dispatch(logout())` để dọn sạch Redux và LocalStorage.
    - Dùng `window.location.href = '/login'` để ép trình duyệt chuyển hướng (redirect) thẳng về trang đăng nhập.
  - Nếu là lỗi khác, nó ném trả lỗi đó về cho component tự xử lý.

## Duoc su dung boi (dependents)
- Tất cả các file trong thư mục `frontend/src/services/` (`authService`, `examService`, `resultService`) đều import `apiClient` từ đây để xài.

## Diem dang chu y (neu co)
- **Truy cập Store ngoài React**: Thông thường trong React, chúng ta dùng hook `useSelector` để lấy state. Nhưng vì `axios.js` là một file JS thuần (chạy bên ngoài cây component React), nó phải gọi trực tiếp `store.getState()` và `store.dispatch()`. Đây là một pattern chuẩn và rất hữu dụng khi viết middleware/interceptors.
- Lệnh `window.location.href` ở dòng 30 sẽ gây tải lại toàn bộ trang web (full page reload). Ở các hệ thống tối ưu SPA (Single Page Application) hơn, người ta thường tiêm (inject) hàm điều hướng của `react-router` vào axios để chuyển trang mượt mà hơn mà không bị chớp trắng màn hình, nhưng cách hiện tại là dễ code nhất.

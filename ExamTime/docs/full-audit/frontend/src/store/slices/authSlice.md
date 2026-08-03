# frontend/src/store/slices/authSlice.js

## Muc dich (1-2 cau)
File này quản lý trạng thái xác thực (Authentication State) của người dùng trên toàn bộ ứng dụng Frontend. Nó không chỉ giữ thông tin đăng nhập trong RAM (Redux) mà còn đồng bộ hóa dữ liệu này với `localStorage` để giữ cho người dùng vẫn đăng nhập ngay cả khi họ tải lại trang hoặc đóng trình duyệt.

## Import / phu thuoc
- `createSlice` từ `@reduxjs/toolkit`: Khởi tạo Redux slice.

## Noi dung chi tiet
- **Hằng số `TOKEN_STORAGE_KEY`, `USER_STORAGE_KEY`**: Định nghĩa tên key để lưu vào localStorage (ví dụ: `examtime_token`).
- **`loadInitialState()`**: Hàm mồi (bootstrap) chạy duy nhất một lần khi ứng dụng vừa tải (F5).
  - Nó đọc token và user từ `localStorage`.
  - Có khối `try...catch` để đề phòng lỗi `JSON.parse` nếu dữ liệu trong localStorage bị hỏng (corrupted).
  - Trả về state ban đầu gồm `{ user, token, isAuthenticated }`. `isAuthenticated` tự động là `true` nếu cả user và token đều tồn tại.
- **`authSlice`**: Khai báo slice với `initialState` lấy từ hàm trên.
- **`reducers`**:
  - `loginSuccess(state, action)`: Được gọi khi gọi API đăng nhập thành công. Gán `token`, `user` vào Redux state và đồng thời lưu (persist) xuống `localStorage`.
  - `updateUser(state, action)`: Dùng để cập nhật thông tin user (ví dụ: đổi tên, avatar). Dùng spread operator `{ ...state.user, ...action.payload }` để gộp dữ liệu mới vào dữ liệu cũ. Sau đó cũng lưu đè xuống `localStorage`.
  - `logout(state)`: Xóa toàn bộ dữ liệu trong Redux state (`user = null`, `token = null`) và xóa trắng trong `localStorage` bằng `removeItem`.
- Export các actions và reducer.

## Duoc su dung boi (dependents)
- `frontend/src/store/index.js`: Gắn vào global store.
- `frontend/src/pages/Login.jsx`: Gọi `loginSuccess` sau khi nhận phản hồi từ backend.
- `frontend/src/components/Layout/Navbar.jsx` và `AppSidebar.jsx`: Gọi `logout` khi người dùng bấm nút Đăng xuất.
- `frontend/src/config/axios.js`: Import `logout` để tự động văng ra màn hình đăng nhập nếu backend báo lỗi `401 Unauthorized` (hết hạn token).

## Diem dang chu y (neu co)
- **Bảo mật LocalStorage**: Việc lưu trữ Token trực tiếp vào `localStorage` rất dễ thực hiện nhưng có rủi ro bị tấn công XSS (Cross-Site Scripting). Kẻ tấn công có thể chạy một đoạn script nhỏ để lấy cắp chuỗi token này. Tuy nhiên, với một dự án làm web luyện thi quy mô vừa và nhỏ, cơ chế này hoàn toàn chấp nhận được và rất phổ biến. Ở các hệ thống ngân hàng lớn, người ta thường đổi sang dùng `HttpOnly Cookies`.

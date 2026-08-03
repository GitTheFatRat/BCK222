# frontend/src/store/index.js

## Muc dich (1-2 cau)
File này là nơi khởi tạo và cấu hình kho chứa dữ liệu toàn cục (Global Store) của ứng dụng Frontend, sử dụng thư viện Redux Toolkit. Nó kết nối tất cả các state nhỏ (slices) lại thành một state tree duy nhất để toàn bộ ứng dụng có thể truy cập.

## Import / phu thuoc
- `configureStore` từ `@reduxjs/toolkit`: Hàm chuẩn của Redux Toolkit để setup store nhanh gọn, tự động tích hợp sẵn các middleware cần thiết (như thunk) và Redux DevTools.
- `authReducer`: Quản lý trạng thái đăng nhập/user.
- `examSessionReducer`: Quản lý trạng thái của phiên thi đang diễn ra (thời gian, mã đề, trang hiện tại).
- `answerReducer`: Quản lý các đáp án mà thí sinh đã chọn/nhập.

## Noi dung chi tiet
- Gọi hàm `configureStore` và truyền vào một object cấu hình.
- `reducer`: Khai báo 3 slice chính của ứng dụng:
  - `auth`: Chứa dữ liệu user hiện tại.
  - `examSession`: Chứa cấu hình của bài thi đang làm.
  - `answers`: Chứa toàn bộ câu trả lời.
- `devTools`: `import.meta.env.MODE !== 'production'`. Tính năng này cho phép bật Redux DevTools Extension trên trình duyệt khi đang dev, nhưng sẽ tự động tắt khi build ra production để bảo mật dữ liệu và tăng hiệu năng.
- Xuất (export) biến `store` để sử dụng ở những nơi khác.

## Duoc su dung boi (dependents)
- `frontend/src/main.jsx`: Import `store` và bọc (wrap) toàn bộ ứng dụng React bằng `<Provider store={store}>`, giúp mọi component đều có thể dùng hook `useSelector` và `useDispatch`.
- `frontend/src/config/axios.js`: Import `store` để lấy token (`store.getState().auth.token`) gắn vào header của mọi request gọi lên API.

## Diem dang chu y (neu co)
- **Tổ chức State**: Việc tách `examSession` (trạng thái phòng thi) và `answers` (đáp án) ra thành 2 slice riêng biệt là một thiết kế rất thông minh. Nó giúp giảm thiểu việc re-render (render lại giao diện) không cần thiết: Khi user gõ 1 chữ vào ô đáp án, chỉ `answerReducer` cập nhật, các component liên quan đến đếm ngược thời gian (thuộc `examSession`) sẽ không bị ảnh hưởng.

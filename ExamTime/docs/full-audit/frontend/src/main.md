# frontend/src/main.jsx

## Muc dich (1-2 cau)
File này là điểm nhập (Entry Point) của toàn bộ ứng dụng ReactJS. Nhiệm vụ duy nhất của nó là khởi tạo (bootstrap) ứng dụng, bọc các thư viện nền tảng (Redux, React Router) vào Component gốc (`App`) và gắn tất cả vào DOM của trình duyệt (thẻ `<div id="root">`).

## Import / phu thuoc
- `StrictMode` từ `react`.
- `createRoot` từ `react-dom/client` (API chuẩn của React 18).
- `Provider` từ `react-redux`: Cung cấp Global State cho toàn bộ ứng dụng.
- `BrowserRouter` từ `react-router-dom`: Bật tính năng điều hướng (Routing) bằng HTML5 History API.
- `store` từ `./store`: Khởi tạo Redux Store.
- `App` từ `./App.jsx`: Component giao diện cao nhất.
- `index.css` và `components/components.css`: Nạp toàn bộ CSS toàn cục (Global CSS) vào dự án.

## Noi dung chi tiet
- Lấy phần tử HTML có ID là `root` (`document.getElementById('root')`). Nếu không tìm thấy (do file `index.html` bị lỗi), ném ra một Error để chặn ứng dụng chạy tiếp.
- Dùng `createRoot` để render hệ thống Component theo hệ thống phân cấp (Hierarchy) chuẩn mực:
  - `<StrictMode>`: Bọc ngoài cùng để React tự động cảnh báo các đoạn code cũ (legacy) hoặc các vấn đề tiềm ẩn về memory leak trong quá trình phát triển (Chỉ chạy ở chế độ Development).
  - `<Provider store={store}>`: Cung cấp kho dữ liệu Redux cho toàn bộ cây Component bên trong. Bất kỳ component nào cũng có thể gọi `useSelector` hoặc `useDispatch`.
  - `<BrowserRouter>`: Cho phép `<App />` bên trong sử dụng các thẻ `<Route>` và `<Link>`.

## Duoc su dung boi (dependents)
- File `frontend/index.html`: Được trình duyệt nhúng trực tiếp vào thông qua thẻ `<script type="module" src="/src/main.jsx"></script>`. Khi trang web tải, file này là file Javascript đầu tiên được thực thi.

## Diem dang chu y (neu co)
- Mã nguồn viết rất sạch sẽ và tuân thủ tuyệt đối chuẩn mực của React 18 / Vite.
- Việc import 2 file CSS (`index.css` và `components.css`) ở cấp độ cao nhất này đảm bảo CSS được Vite đóng gói (bundle) và tải xuống trước khi các Component bắt đầu render, tránh hiện tượng giật màn hình (FOUC - Flash of Unstyled Content).

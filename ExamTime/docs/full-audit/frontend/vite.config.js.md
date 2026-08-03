# frontend/vite.config.js

## Muc dich (1-2 cau)
File này cấu hình hành vi của công cụ Build Vite. Vite chịu trách nhiệm gom các file mã nguồn rời rạc lại, biên dịch cú pháp JSX thành JS thuần, nén CSS và tối ưu hóa ứng dụng.

## Import / phu thuoc
- `defineConfig` từ `vite`: Hàm bọc giúp IDE (như VSCode) nhận diện cú pháp (autocomplete) tốt hơn.
- `react` từ `@vitejs/plugin-react`: Plugin cho phép Vite biên dịch mã nguồn của React.

## Noi dung chi tiet
- Kích hoạt plugin `react()`. Nhờ plugin này, Vite có thể hiểu được cú pháp JSX/TSX và kích hoạt tính năng Fast Refresh (cập nhật giao diện ngay lập tức khi code thay đổi mà không cần tải lại toàn bộ trang).
- Cấu hình Server: Đặt cứng cổng `port: 5173`. Điều này đảm bảo rằng mỗi khi gõ lệnh `npm run dev`, Frontend sẽ luôn chạy ở địa chỉ `http://localhost:5173`. Việc chốt chặt cổng này rất quan trọng để cấu hình CORS (Chính sách nguồn gốc chéo) bên phía Backend có thể hoạt động chính xác.

## Duoc su dung boi (dependents)
- Tiến trình Node.js ngầm của Vite sẽ tự động tìm và đọc file này mỗi khi chạy lệnh `vite` (dev) hoặc `vite build`.

## Diem dang chu y (neu co)
- Một cấu hình cực kỳ cơ bản nhưng đủ dùng. Không có proxy, không có cấu hình đường dẫn tuyệt đối (aliases). Điều này phản ánh tính đơn giản và dễ hiểu của toàn bộ cấu trúc dự án.

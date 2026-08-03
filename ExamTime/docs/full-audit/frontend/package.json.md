# frontend/package.json

## Muc dich (1-2 cau)
Đây là file quản lý thông tin của toàn bộ dự án Frontend (tên, phiên bản), cấu hình các câu lệnh chạy (scripts), và quan trọng nhất là danh sách tất cả các thư viện/framework (Dependencies) cần thiết để chạy dự án.

## Import / phu thuoc
- Không có.

## Noi dung chi tiet
- `name`, `version`, `private: true`: Định danh dự án. `private` đảm bảo dự án không vô tình bị publish nhầm lên npm.
- `type: "module"`: Cho phép dự án sử dụng cú pháp ES Modules (import/export) thay vì cú pháp CommonJS cũ (require).
- `scripts`:
  - `dev`: Chạy lệnh `vite` để khởi động máy chủ phát triển (Development Server) đi kèm tính năng Hot Module Replacement.
  - `build`: Chạy lệnh `vite build` để đóng gói (bundle) toàn bộ mã nguồn ra HTML/CSS/JS thuần, tối ưu hóa cho môi trường Production.
  - `preview`: Chạy server mô phỏng môi trường Production ngay trên máy ảo.
- `dependencies`:
  - `react`, `react-dom` (Phiên bản 19.x): Thư viện cốt lõi của React.
  - `react-router-dom`: Quản lý điều hướng trang (Routing).
  - `@reduxjs/toolkit`, `react-redux`: Thư viện quản lý Global State cực kỳ mạnh mẽ.
  - `axios`: Dùng để gửi các HTTP Request (Gọi API).
- `devDependencies`:
  - `vite` và plugin `@vitejs/plugin-react`: Công cụ build cực nhanh chuyên dụng cho React, thay thế hoàn toàn cho Webpack cũ kỹ.

## Duoc su dung boi (dependents)
- Công cụ `npm` (hoặc `yarn`, `pnpm`) đọc file này để biết cần phải tải xuống những gói thư viện nào khi chạy lệnh `npm install`.

## Diem dang chu y (neu co)
- **Công nghệ rất mới**: Việc sử dụng Vite + React 19 cho thấy dự án đang đi theo những tiêu chuẩn (stack) hiện đại và tối ưu nhất của hệ sinh thái Frontend thời điểm hiện tại.
- Các phụ thuộc (dependencies) được giữ ở mức cực kỳ tối giản (chỉ có các trụ cột chính: Router, Redux, Axios). Điều này chứng tỏ tác giả không lạm dụng thư viện ngoài mà tự tay code phần lớn các Component giao diện.

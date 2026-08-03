# frontend/src/components/Navbar.jsx

## Muc dich (1-2 cau)
File này là một file trung gian (Barrel export), dùng để tái xuất (re-export) component `Navbar` từ thư mục `Layout/Navbar.jsx`.

## Import / phu thuoc
- Import default từ `./Layout/Navbar.jsx`.

## Noi dung chi tiet
- `export { default } from './Layout/Navbar.jsx';`: Re-export nguyên mẫu component Navbar ra ngoài để các file khác (như `App.jsx` cũ) có thể import với đường dẫn ngắn gọn.

## Duoc su dung boi (dependents)
- **Không có file nào (Dead Code)**: Trong quá trình phát triển (ở một commit trước), ứng dụng đã được tái cấu trúc (refactor) để chuyển từ thiết kế "Thanh điều hướng trên cùng" (Top Navbar) sang thiết kế "Thanh bên" (Sidebar - sử dụng `AppSidebar.jsx`). Do đó, file này hiện tại không còn được import ở bất kỳ đâu.

## Diem dang chu y (neu co)
- Nên xóa file này (cùng với `Layout/Navbar.jsx`) để giữ cho codebase sạch sẽ (Clean Code), tránh gây nhầm lẫn cho các lập trình viên vào sau.

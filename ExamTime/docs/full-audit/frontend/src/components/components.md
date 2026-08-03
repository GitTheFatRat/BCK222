# frontend/src/components/components.css

## Muc dich (1-2 cau)
File CSS này đóng vai trò như một kho chứa (stylesheet) dùng chung cho rất nhiều giao diện component nhỏ lẻ trong dự án (ví dụ: Navbar, Sidebar, Form, Modal, Button). Nó giúp tập trung code giao diện thay vì chia nhỏ CSS vào từng folder component riêng lẻ.

## Import / phu thuoc
- Không phụ thuộc vào thư viện CSS nào (sử dụng CSS thuần - Vanilla CSS).

## Noi dung chi tiet
- **Biến (CSS Variables / Root)**: Khai báo một hệ thống màu chuẩn ở đầu file (`:root`) như `--et-navy` (xanh dương đậm), `--et-border` (màu viền), `--et-text` (màu chữ đen nhạt). Hệ thống này đảm bảo tính nhất quán (consistency) trên toàn bộ trang web.
- Định nghĩa các khối CSS (Blocks) theo phương pháp BEM (Block Element Modifier) hoặc gần giống BEM:
  - `.navbar`: Giao diện thanh điều hướng trên cùng.
  - `.footer`: Giao diện chân trang.
  - Các thành phần khác (chứa hơn 800 dòng code phục vụ cho việc layout, đổ bóng, màu sắc của rất nhiều thẻ HTML).

## Duoc su dung boi (dependents)
- `frontend/src/main.jsx`: Import file này bằng cú pháp `import './components/components.css';` để toàn bộ ứng dụng có thể nhận diện được các class khai báo ở đây.

## Diem dang chu y (neu co)
- **Thiết kế "Cục bộ" (Monolithic CSS)**: Việc gom quá nhiều CSS của các thành phần khác biệt (Navbar, Sidebar, AudioPlayer) vào chung một file `components.css` dài hơn 800 dòng khiến cho việc bảo trì, tìm kiếm code khó khăn hơn. Một cách tiếp cận tốt hơn là chia tách thành các module (ví dụ: `Navbar.module.css`, `Sidebar.module.css`) hoặc sử dụng Tailwind CSS. File này đang có dấu hiệu lặp lại khối `:root` ở dòng 87 (do quá trình dev copy-paste quên xóa).

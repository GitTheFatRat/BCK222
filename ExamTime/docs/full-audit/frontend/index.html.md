# frontend/index.html

## Muc dich (1-2 cau)
Đây là trang HTML duy nhất (Single Page) của toàn bộ ứng dụng. Vai trò của nó là cung cấp cái khung rỗng (div#root) để React "nhúng" (mount) toàn bộ giao diện vào, đồng thời khai báo tiêu đề trang và nạp phông chữ.

## Import / phu thuoc
- Gọi thẻ `<script type="module" src="/src/main.jsx"></script>` để kích hoạt chuỗi phản ứng dây chuyền khởi động React.
- Import bộ phông chữ `Inter` từ Google Fonts thông qua thẻ `<link>`.

## Noi dung chi tiet
- `<!DOCTYPE html>`: Khai báo chuẩn HTML5.
- `<meta name="viewport" ...>`: Cấu hình bắt buộc để giao diện có thể hiển thị Responsive chuẩn xác trên các thiết bị di động.
- `<title>`: Cài đặt tiêu đề sẽ hiển thị trên tab của trình duyệt web (ExamTime - IELTS Practice & Mock Test Platform).
- `<div id="root"></div>`: Đây chính là phần tử quan trọng nhất. Đây là cái "chậu rỗng", nơi file `main.jsx` sẽ "trồng" toàn bộ "cây giao diện" React vào. Bất kể ứng dụng có hàng nghìn Component, cuối cùng tất cả đều nằm gọn trong thẻ `div` này.

## Duoc su dung boi (dependents)
- Vite sử dụng trực tiếp file này làm tệp đầu vào (Entry Point). Khi bạn truy cập ứng dụng trên trình duyệt, đây là file đầu tiên trình duyệt tải về.

## Diem dang chu y (neu co)
- Đây là đặc trưng kinh điển của kiến trúc Single Page Application (SPA). Toàn bộ dự án chỉ có đúng 1 file HTML, mọi sự thay đổi nội dung trang web (chuyển qua lại giữa Đăng nhập, Trang chủ, Thi thử) đều được React bóp nặn và vẽ lại (re-render) thông qua Javascript ngay trên trình duyệt mà không cần tải lại trang.

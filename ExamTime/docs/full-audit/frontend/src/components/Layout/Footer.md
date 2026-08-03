# frontend/src/components/Layout/Footer.jsx

## Muc dich (1-2 cau)
File này định nghĩa giao diện (UI Component) của chân trang (Footer), hiển thị dòng chữ bản quyền (Copyright) nằm ở dưới cùng của ứng dụng web.

## Import / phu thuoc
(Không import gì thêm, chỉ sử dụng React cơ bản).

## Noi dung chi tiet
- `export default function Footer()`: Component React thuần (Stateless Functional Component).
- Trả về thẻ `<footer>` chứa class `footer`.
- Sử dụng hàm JavaScript thuần `new Date().getFullYear()` để luôn hiển thị năm hiện tại (ví dụ: `© 2026 ExamTime...`) một cách linh động mà không cần phải cập nhật lại code thủ công vào mỗi dịp năm mới.

## Duoc su dung boi (dependents)
- `frontend/src/components/Footer.jsx`: Được file proxy kia import và re-export lại để cấp cho `App.jsx`.

## Diem dang chu y (neu co)
- Đây là một thành phần giao diện cực kỳ cơ bản và "tĩnh". Class `.footer` được định nghĩa trong `components.css` với các thuộc tính cơ bản như căn giữa chữ (`text-align: center`) và đệm (`padding`).

# frontend/src/components/Sidebar.jsx

## Muc dich (1-2 cau)
File này là một proxy/barrel export dùng để xuất ra component Sidebar từ bên trong thư mục `Layout/`. 

## Import / phu thuoc
- Import default từ `./Layout/Sidebar.jsx`.

## Noi dung chi tiet
- Lệnh `export { default } from './Layout/Sidebar.jsx';` giúp đưa component Sidebar gốc ra cấp ngoài cùng của thư mục components.

## Duoc su dung boi (dependents)
- **Không có file nào**: Đây là tàn dư (Dead Code) của đợt chuyển đổi kiến trúc. Ban đầu nó được sinh ra để tương thích ngược, nhưng hiện tại file `ExamRoom.jsx` đã sửa lại đường dẫn để import trực tiếp từ `../components/Layout/Sidebar.jsx`. Do đó, file proxy này đang không có ai sử dụng và có thể xóa.

## Diem dang chu y (neu co)
- **Dễ nhầm lẫn tên gọi**: Đừng nhầm lẫn `Sidebar.jsx` này (dùng để hiển thị bảng câu hỏi trong phòng thi) với `AppSidebar.jsx` (dùng để điều hướng tổng thể bên trái màn hình). Việc đặt tên component khá dễ gây bối rối, nên đổi tên file gốc thành `ExamQuestionPalette.jsx` để phản ánh đúng chức năng.

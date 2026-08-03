# frontend/src/pages/AdminCheatingLogs.jsx

## Muc dich (1-2 cau)
File này là một trang (Page) dành riêng cho Quản trị viên (Admin), hiển thị danh sách các bài thi và báo cáo chi tiết về số lần người dùng gian lận (ví dụ: chuyển tab, đổi cửa sổ) trong quá trình làm bài. Trang này có tính năng lọc (filter) để chỉ hiện ra những bài có dấu hiệu gian lận.

## Import / phu thuoc
- `useState`, `useEffect`, `useCallback` từ `react`.
- `getCheatingLogs` từ `../services/resultService.js`: API gọi lên backend để lấy dữ liệu.

## Noi dung chi tiet
- Component sử dụng các state cơ bản: `results` (mảng dữ liệu thô), `isLoading`, `loadError`, `filterOnlyCheated` (cờ boolean quy định việc bật tắt bộ lọc), và `expandedId` (lưu ID của bài thi đang được bấm mở rộng ra để xem chi tiết).
- `fetchLogs`: Hàm gọi API để nạp dữ liệu từ server khi trang vừa mount (`useEffect`).
- **Logic Lọc (Filtering)**: 
  - Biến `filtered` sẽ tính toán mảng dữ liệu mới. Nếu `filterOnlyCheated` là true (mặc định là true), nó dùng `.filter()` để loại bỏ những bài thi không có dữ liệu gian lận (`cheatingLog.length === 0`). Ngược lại, nó giữ nguyên tất cả.
- **Phần Render**:
  - Giao diện Header và ô Checkbox để bật tắt tính năng lọc.
  - Xử lý các trạng thái `Loading` và `Empty State`.
  - Nếu có dữ liệu, dùng `.map()` render ra danh sách các khối `div.admin-task-card`.
  - Khối Header của Card: Hiển thị tên thí sinh, kỹ năng, số lượng lần gian lận (bằng thẻ Badge), và ngày thi. 
  - Khối Body của Card (chỉ hiện ra khi `isExpanded` là true):
    - Nếu không gian lận: In ra câu chúc mừng (mặc dù khối này hiếm khi xuất hiện nếu bật bộ lọc).
    - Nếu có gian lận: Vẽ một bảng `<table>` liệt kê chi tiết từng sự kiện (Event Type) và thời gian (Timestamp) xảy ra gian lận. Mã lỗi `TAB_SWITCH` được dịch sang ngôn ngữ thân thiện hơn là *"Tab Switched / Window Blur"*.

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Được mount vào Route `/admin/cheating-logs` (và được bọc bởi `<AdminRoute>`).

## Diem dang chu y (neu co)
- **Thiết kế thân thiện (UX)**: Việc trang tự động mặc định chọn "Show only submissions with recorded cheating events" là một UX xuất sắc. Admin thường chỉ quan tâm tới những người gian lận, không cần xem những bài thi "sạch", điều này tiết kiệm rất nhiều thời gian dò tìm.
- Việc click vào thẻ (Header của Card) để xổ xuống (Expand/Collapse) bảng chi tiết giúp giao diện trông gọn gàng hơn thay vì bày tất cả các bảng ra màn hình.

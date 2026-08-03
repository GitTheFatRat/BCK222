# frontend/src/components/RouteGuard.jsx

## Muc dich (1-2 cau)
File này đóng vai trò chặn người dùng vô tình tải lại trang (F5) hoặc đóng tab trình duyệt khi họ đang làm bài thi. Nó hiển thị một hộp thoại cảnh báo (Confirmation Dialog) của trình duyệt để yêu cầu người dùng xác nhận việc thoát trang.

## Import / phu thuoc
- `useEffect` từ `react`.
- `useSelector` từ `react-redux`: Để lấy trạng thái thi.

## Noi dung chi tiet
- Lấy biến `status` từ kho Redux (`state.examSession.status`).
- Dùng `useEffect` để đăng ký sự kiện `beforeunload` (sự kiện của trình duyệt khi sắp đóng tab hoặc F5).
  - Khối logic: `if (status === 'IN_PROGRESS')`. Nếu đang thi, nó gọi `e.preventDefault()` và `e.returnValue = ''`. Đây là chuẩn (standard) của các trình duyệt hiện đại (như Chrome, Firefox) để kích hoạt hộp thoại cảnh báo mặc định kiểu *"Bạn có chắc chắn muốn rời đi? Những thay đổi của bạn có thể không được lưu"*.
- Có một hàm tên là `notificationIfLeaving` chứa lệnh `alert`, tuy nhiên hàm này hoàn toàn **chưa được sử dụng** (chưa được gọi ở bất kỳ đâu trong component).
- Cuối cùng trả về `children` (hiển thị giao diện con bình thường).

## Duoc su dung boi (dependents)
- `frontend/src/App.jsx`: Component này bọc (wrap) toàn bộ nội dung của thẻ `<BrowserRouter>` trong file App. Nghĩa là cơ chế canh gác chống F5 này luôn được bật ở trạng thái chờ trên toàn bộ các trang, nhưng chỉ thực sự phát huy tác dụng khi người dùng vào phòng thi (status biến thành `IN_PROGRESS`).

## Diem dang chu y (neu co)
- **Dead Code**: Hàm `notificationIfLeaving` là thừa thãi và có thể an tâm xóa bỏ.
- Lưu ý rằng cơ chế `beforeunload` chỉ có thể chặn thao tác trên trình duyệt, không thể chặn người dùng điều hướng nội bộ thông qua các link React Router (ví dụ bấm nút Back của con chuột). Để chặn triệt để, thông thường cần dùng thêm các hook như `useBlocker` hoặc `Prompt` của React Router v6. Tuy nhiên, tính năng hiện tại cũng đã đủ tốt để ngăn chặn rủi ro thường gặp nhất là lỡ tay ấn F5.

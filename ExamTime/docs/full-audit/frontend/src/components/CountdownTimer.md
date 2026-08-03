# frontend/src/components/CountdownTimer.jsx

## Muc dich (1-2 cau)
File này hiển thị đồng hồ đếm ngược thời gian làm bài của thí sinh. Nó tự động cập nhật mỗi giây và chuyển sang trạng thái cảnh báo (đổi màu đỏ/chớp nháy) khi thời gian sắp hết.

## Import / phu thuoc
- `useEffect` từ `react`: Dùng để thiết lập vòng lặp thời gian (`setInterval`).
- `useDispatch`, `useSelector` từ `react-redux`: Lấy dữ liệu và gửi action lên Redux Store.
- `tick` từ `../store/slices/examSessionSlice.js`: Action giảm 1 giây.

## Noi dung chi tiet
- Khai báo biến `WARNING_THREADOLD_SECOND = 300` (tức là 5 phút).
- Lấy `remainingSeconds` và `status` từ Redux Store.
- **Vòng lặp thời gian (Timer Interval)**:
  - Sử dụng `useEffect` lắng nghe `status`. Nếu trạng thái đang là `IN_PROGRESS` (đang thi), nó tạo ra một `setInterval` chạy mỗi 1000ms (1 giây).
  - Mỗi giây trôi qua, gọi `dispatch(tick())` để giảm số giây trong Redux.
  - Hàm `cleanup` (trả về `clearInterval`) đảm bảo vòng lặp bị hủy khi user thoát trang hoặc nộp bài, tránh lỗi rò rỉ bộ nhớ (memory leak).
- **Tính toán hiển thị**:
  - `minutes = Math.floor(remainingSeconds / 60)` và `seconds = remainingSeconds % 60`.
  - Dùng hàm `String(x).padStart(2, '0')` để luôn hiển thị định dạng 2 chữ số (ví dụ: `09:05` thay vì `9:5`).
- **Giao diện**:
  - Trả về thẻ `<div>` chứa class `countdown-timer`.
  - Nếu thời gian còn dưới 5 phút (`isWarning = true`), nó tự động gắn thêm class `countdown-timer--warning` (class này được CSS tô màu đỏ).

## Duoc su dung boi (dependents)
- `frontend/src/pages/ExamRoom.jsx`: Import vào và gắn ở góc trên (hoặc góc Sidebar) của phòng thi.

## Diem dang chu y (neu co)
- **Độ chính xác của `setInterval`**: Hàm `setInterval` của trình duyệt không hoàn toàn chính xác 100% (nếu trình duyệt bị lag, 1 giây có thể giãn ra thành 1.1s). Với bài thi 60 phút, sai số có thể lên tới vài chục giây. Tuy nhiên, vì mục đích của đồ án là mô phỏng, mức độ chính xác này là chấp nhận được. Ở các hệ thống thi thật (như thi Đại học), người ta sẽ tính toán dựa trên `Date.now()` trừ đi mốc thời gian gốc (start time) lưu trong DB để đảm bảo độ chính xác tuyệt đối.

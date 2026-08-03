# frontend/src/store/slices/examSessionSlice.js

## Muc dich (1-2 cau)
File này đóng vai trò như một "trọng tài" giám sát phiên thi của người dùng. Nó theo dõi trạng thái hiện tại (đang thi hay đã nộp bài), quản lý thời gian đếm ngược (countdown timer), và đặc biệt là ghi lại (log) các hành vi gian lận (cheating) trong lúc làm bài.

## Import / phu thuoc
- `createSlice` từ `@reduxjs/toolkit`.

## Noi dung chi tiet
- **`initialState`**:
  - `examId`, `skill`: Mã bài thi và kỹ năng đang làm (Listening, Reading...).
  - `remainingSeconds`: Số giây còn lại của bài thi.
  - `status`: Trạng thái phòng thi (`IDLE`, `IN_PROGRESS`, `SUBMITTED`).
  - `cheatingLog`: Một mảng rỗng để hứng các log gian lận.
- **`reducers`**:
  - `startSession`: Khởi tạo phòng thi mới. Nhận vào thông số thời gian, đặt `status` thành `IN_PROGRESS` và dọn sạch `cheatingLog`.
  - `tick`: Giảm `remainingSeconds` đi 1 giây mỗi khi được gọi (được gọi từ một `setInterval` ở Component). Nếu thời gian về `<= 0`, tự động ép `status` thành `SUBMITTED` để báo hiệu hết giờ.
  - `logCheatingEvent`: Đẩy một object chứa `timestamp` (thời điểm) và `type` (loại gian lận, ví dụ: chuyển tab, đổi cửa sổ) vào mảng `cheatingLog`.
  - `endSession`: Dùng khi user chủ động bấm nút "Nộp bài" sớm. Đổi trạng thái sang `SUBMITTED`.
  - `resetSession`: Đưa toàn bộ phiên thi về trạng thái `IDLE` ban đầu (dùng khi rời phòng thi).

## Duoc su dung boi (dependents)
- `frontend/src/pages/ExamRoom.jsx`: Component phòng thi chính sử dụng mọi action trong này để bắt đầu, kết thúc bài thi, và lắng nghe sự kiện `visibilitychange` (chuyển tab) để gọi `logCheatingEvent`.
- `frontend/src/components/CountdownTimer.jsx`: Import action `tick`. File này chứa vòng lặp `setInterval` và `dispatch(tick())` mỗi giây.
- `frontend/src/store/index.js`: Mount reducer vào global store.

## Diem dang chu y (neu co)
- **Tối ưu hiệu năng**: Việc gọi dispatch `tick()` mỗi 1 giây trong Redux là một anti-pattern nhẹ vì nó khiến Redux store thay đổi liên tục và báo event liên tục. Tuy nhiên, vì React-Redux đã tối ưu rất tốt việc theo dõi (subscribing) ở cấp độ component, chỉ những component nào gọi `useSelector(state => state.examSession.remainingSeconds)` mới bị re-render. Do đó, thiết kế này vẫn chạy rất mượt và không gây giật lag toàn bộ trang web.

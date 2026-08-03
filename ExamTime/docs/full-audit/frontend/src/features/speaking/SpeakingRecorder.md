# frontend/src/features/speaking/SpeakingRecorder.jsx

## Muc dich (1-2 cau)
File này cung cấp giao diện thu âm bằng micro của người dùng cho bài thi Speaking (cụ thể là Part 2). Nó tự động đếm ngược 60 giây để chuẩn bị, sau đó tự động bật mic ghi âm trong 120 giây, và cuối cùng lưu file ghi âm (dạng Blob) lên Redux Store.

## Import / phu thuoc
- Các hook cơ bản của React: `useState`, `useRef`, `useEffect`, `useCallback`.
- `useDispatch` từ `react-redux`.
- `setSpeakingRecording` từ `../../store/slices/answerSlice`: Action lưu trữ đường dẫn file âm thanh.

## Noi dung chi tiet
- **State và Refs**:
  - `phase`: Trạng thái hiện tại của quá trình thu âm, gồm `PREP` (chuẩn bị), `RECORDING` (đang thu), `DONE` (hoàn thành), `ERROR` (lỗi mic).
  - `countdown`: Số giây đếm ngược.
  - Các `useRef` dùng để lưu lại các object của trình duyệt nhằm dọn dẹp (cleanup) sau này, tránh memory leak: `mediaRecorderRef`, `chunksRef`, `streamRef`, `countdownIntervalRef`, `autoStopTimeoutRef`.
- **Logic hoạt động**:
  - **Giai đoạn `PREP`**: Vừa vào là bộ đếm lùi 60 giây chạy (thông qua `setInterval`). Khi về `0`, nó đổi phase sang `RECORDING`.
  - **Giai đoạn `RECORDING`**:
    - Trình duyệt yêu cầu quyền truy cập Micro bằng API `navigator.mediaDevices.getUserMedia({ audio: true })`.
    - Khởi tạo `MediaRecorder` để ghi luồng âm thanh. Mỗi khi có dữ liệu (sự kiện `ondataavailable`), nó đẩy (push) vào mảng `chunksRef`.
    - Gán một bộ hẹn giờ `setTimeout` 120 giây (bằng `talkSeconds`). Khi hết 120 giây, gọi `recorder.stop()`.
    - Khi có sự kiện `onstop` (do hết 120s hoặc do user tự bấm nút Stop), hệ thống gộp các mảnh chunk lại thành một file `Blob` (định dạng `audio/webm`), tạo một URL cục bộ (`URL.createObjectURL`) và gửi URL này lên Redux thông qua `setSpeakingRecording`. Cuối cùng ngắt kết nối mic (`track.stop()`) và chuyển sang `DONE`.
  - Nếu gặp lỗi (ví dụ user từ chối cấp quyền mic), catch block sẽ bắt lỗi và nhảy sang `ERROR`.

## Duoc su dung boi (dependents)
- `frontend/src/pages/PracticeRoom.jsx` và `ExamRoom.jsx`: Dùng khi user thi phần Speaking.

## Diem dang chu y (neu co)
- **Tương tác Web API**: Component này là một ví dụ mẫu mực về cách giao tiếp với WebRTC / MediaStream API của trình duyệt. Việc sử dụng rất nhiều `useRef` và các hàm dọn dẹp `clearInterval`, `track.stop()` trong khối `useEffect return` là bắt buộc để hệ thống không bị crash hoặc chiếm dụng micro liên tục khi người dùng vô tình chuyển trang.
- Định dạng xuất ra là `audio/webm`, tương thích tốt với Chrome/Firefox. Tuy nhiên, iOS Safari có thể cần định dạng `audio/mp4` để hoạt động trơn tru nhất.

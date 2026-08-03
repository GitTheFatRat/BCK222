# frontend/src/services/resultService.js

## Muc dich (1-2 cau)
File này quản lý các API liên quan đến quá trình nộp bài, chấm điểm và xem lịch sử kết quả. Khác với các Service khác chỉ dùng JSON, file này có xử lý đặc biệt (FormData) để hỗ trợ việc tải lên (upload) file ghi âm bài thi Speaking.

## Import / phu thuoc
- `apiClient` từ `../config/axios.js`.

## Noi dung chi tiet
Cung cấp 5 hàm chính:
- **`submitExam(payload)`**: 
  - Hàm quan trọng nhất. Thay vì gửi trực tiếp object JSON như thường lệ, nó khởi tạo một đối tượng `FormData()`.
  - Ép kiểu (stringify) các trường dữ liệu dạng Object/Array như `answers` và `cheatingLog` thành chuỗi để có thể đưa vào FormData.
  - Kiểm tra nếu có `speakingRecordingBlob` (file âm thanh), nó sẽ append file đó vào form với tên cố định là `'speaking-recording.webm'`.
  - Gửi POST request lên `/results/submit` với Header `Content-Type: multipart/form-data`.
- **`getMyResultHistory()`**: Gọi GET `/results/me` để lấy danh sách bài đã thi của cá nhân user.
- **`getPendingResults()`**: API dành cho Admin. Gọi GET `/results/admin/pending` để lấy danh sách các bài thi Writing/Speaking đang chờ chấm điểm.
- **`submitGrade(resultId, score)`**: API dành cho Admin. Gửi điểm số (score) do giáo viên chấm lên server bằng phương thức PUT (`/results/admin/:id/grade`).
- **`getCheatingLogs()`**: API dành cho Admin. Lấy danh sách những lần người dùng chuyển tab/gian lận.

## Duoc su dung boi (dependents)
- `frontend/src/pages/ExamRoom.jsx`: Dùng hàm `submitExam` khi người dùng ấn nút nộp bài hoặc hết giờ.
- `frontend/src/pages/HomeDashboard.jsx` và `ResultSummary.jsx`: Dùng `getMyResultHistory` để hiển thị biểu đồ lịch sử và bảng điểm.
- `frontend/src/pages/AdminDashboard.jsx`: Dùng `getPendingResults` để hiển thị danh sách chờ và `submitGrade` khi giáo viên ấn chấm điểm.
- `frontend/src/pages/AdminCheatingLogs.jsx`: Dùng `getCheatingLogs` để hiển thị bảng theo dõi.

## Diem dang chu y (neu co)
- **Hardcode định dạng âm thanh**: Tương tự như bên backend, ở dòng 25 file này cũng ép tên file tải lên phải có đuôi `.webm`. Điều này có thể gây lỗi nếu trình duyệt của người dùng (ví dụ Safari cũ) thu âm ra định dạng `.mp4` hoặc `.ogg` nhưng lại bị ép mác là `.webm`, khiến các thẻ `<audio>` không phát lại được nội dung. Cần cân nhắc lấy động (dynamic) đuôi file dựa trên `Blob.type`.

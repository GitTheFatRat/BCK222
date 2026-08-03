# Luồng Hoạt động Từ Đầu Đến Cuối (End-to-End Flows)

## 1. Người dùng Đăng ký Tài khoản mới
* Bước 1: `[RegisterPage.jsx]` — Hàm `handleSubmit` — Người dùng điền form và bấm Đăng ký. Giao diện gọi hàm đăng ký.
* Bước 2: `[authService.js]` — Hàm `register` — Đóng gói username, email, mật khẩu thành dạng JSON và gửi POST request tới `/api/auth/register`.
* Bước 3: `[authController.js]` — Hàm `register` — Máy chủ nhận dữ liệu, băm mật khẩu, lưu vào cơ sở dữ liệu MongoDB (bảng `User`). Trả về mã 201 (Thành công).
* Bước 4: `[RegisterPage.jsx]` — Giao diện nhận thông báo thành công và chuyển hướng người dùng sang trang Đăng nhập.

## 2. Người dùng Đăng nhập
* Bước 1: `[LoginPage.jsx]` — Hàm `handleSubmit` — Người dùng điền email, mật khẩu và bấm Đăng nhập.
* Bước 2: `[authService.js]` — Hàm `login` — Gửi POST request tới `/api/auth/login`.
* Bước 3: `[authController.js]` — Hàm `login` — Tìm User trong DB, so sánh mật khẩu băm. Tạo chuỗi JWT chứa ID người dùng và trả về kèm thông tin người dùng.
* Bước 4: `[authSlice.js]` — Reducer `setCredentials` — Redux nhận JWT, lưu vào Local Storage (bộ nhớ trình duyệt) để không bị mất khi F5, và đánh dấu trạng thái hệ thống là "Đã đăng nhập".
* Bước 5: `[LoginPage.jsx]` — Chuyển hướng người dùng vào Dashboard (Trang chủ).

## 3. Người dùng Làm bài Nghe (Listening) và Nộp bài
* Bước 1: `[ExamPage.jsx]` — Hàm `useEffect` — Gọi API tải đề thi từ Backend.
* Bước 2: `[ListeningFeature.jsx]` — Người dùng nghe âm thanh và điền đáp án vào các ô trống.
* Bước 3: `[examSlice.js]` — Reducer `setAnswer` — Mỗi chữ người dùng gõ lập tức được lưu lên đám mây Redux.
* Bước 4: `[ExamPage.jsx]` — Hàm `submitExam` — Khi bấm Nộp bài, giao diện gom toàn bộ đáp án từ Redux, sinh ra một `sessionId`, và gọi service gửi nộp.
* Bước 5: `[authMiddleware.js]` — Kiểm tra xem thẻ JWT của học sinh này có hợp lệ không.
* Bước 6: `[resultController.js]` — Hàm `submitResult` — Lấy đáp án chuẩn từ bảng `ListeningSet`, dùng hàm so sánh chuỗi chính xác (strict equality) để đếm số câu đúng, quy đổi ra điểm Band (0-9).
* Bước 7: `[resultController.js]` — Hàm `submitResult` — Lưu tất cả vào bảng `ExamResult` với trạng thái `'GRADED'`. Trả về báo cáo kết quả.
* Bước 8: `[ResultPage.jsx]` — Nhận kết quả và vẽ lên màn hình số câu đúng / điểm số.

## 4. Admin chấm điểm phần Viết (Writing) thủ công
* Bước 1: `[AdminDashboard.jsx]` — Admin vào trang quản trị, gọi API lấy danh sách bài thi đang ở trạng thái `GRADING`.
* Bước 2: `[resultController.js]` — Hàm `getPendingGradingTasks` — Trả về danh sách các bản ghi `ExamResult` chờ chấm.
* Bước 3: `[AdminDashboard.jsx]` — Hàm `handleSubmitGrade` — Admin click mở rộng một bài làm, đọc bài văn hoặc nghe bài nói của học sinh, gõ điểm số (ví dụ: 6.5) vào ô và bấm Lưu.
* Bước 4: `[resultController.js]` — Hàm `gradeResult` — Tìm đúng ID bài nộp, cập nhật điểm `writingBand`. Sau đó gọi hàm tự động `calculateOverallBand` để tính lại điểm tổng kết nếu học sinh đã làm đủ 4 kỹ năng trong cùng một `sessionId`. Lưu DB.

## 5. Admin nạp đề thi mới từ exam-source-bank/
* Bước 1: Admin đặt thư mục chứa file dữ liệu đề (file JSON và các file âm thanh/hình ảnh) vào thư mục `backend/exam-source-bank/`.
* Bước 2: Admin chạy lệnh đồng bộ (ví dụ: `node seed_30_tests.js` hoặc gọi qua một API nạp dữ liệu).
* Bước 3: Mã nguồn script đọc file JSON, tạo các tài liệu `ListeningSet`, `ReadingSet`... riêng biệt trên MongoDB. Lấy mã `_id` của chúng.
* Bước 4: Tạo tài liệu `Exam` mới, gắn các mã `_id` vừa sinh ra vào các trường `listeningSet`, v.v... theo dạng Tham chiếu (References).

## 6. Người dùng Xem lịch sử làm bài (Result History)
* Bước 1: `[DashboardPage.jsx]` — Hàm `fetchHistory` — Gọi API lấy lịch sử.
* Bước 2: `[resultController.js]` — Hàm `getMyResults` — Truy vấn bảng `ExamResult` tìm tất cả kết quả có `user` bằng với người đang gọi.
* Bước 3: `[resultController.js]` — Dùng vòng lặp quét qua toàn bộ kết quả, dùng `sessionId` để gom các kỹ năng lẻ tẻ (Ví dụ kết quả Listening và Writing của cùng 1 lần thi) vào chung một cấu trúc JSON thống nhất, tính điểm tổng, và trả về cho Frontend.
* Bước 4: `[HistoryTable.jsx]` — Giao diện vẽ một bảng danh sách các lần thi và điểm chi tiết.

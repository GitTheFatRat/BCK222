# Hướng dẫn Backend (Backend Walkthrough)

Tài liệu này sẽ dẫn bạn đi từng thư mục của mã nguồn Backend để hiểu cách máy chủ xử lý dữ liệu.

## Thư mục `config/`
**Mục đích:** Chứa các thiết lập và cấu hình khởi tạo cho ứng dụng.
- **`db.js`**: Khi khởi chạy máy chủ, file này chứa hàm gọi tới MongoDB Atlas để thiết lập kết nối cơ sở dữ liệu. Nếu kết nối thất bại, nó sẽ báo lỗi và dừng máy chủ.

## Thư mục `models/`
**Mục đích:** Định nghĩa khuôn mẫu (schema) cho dữ liệu.
- Các file ở đây (như `User.js`, `Exam.js`...) khai báo Mongoose Schema. Nhờ các file này, MongoDB biết trường `email` phải là chuỗi (string), còn trường `role` chỉ được nhận `'student'` hoặc `'admin'`.

## Thư mục `middlewares/`
**Mục đích:** Là những "trạm kiểm soát" nằm giữa lúc người dùng gửi yêu cầu và lúc controller bắt đầu xử lý.
- **`authMiddleware.js`**: Trạm kiểm tra vé. Nó lấy JWT từ tiêu đề (header) của yêu cầu, giải mã nó. Nếu hợp lệ, nó sẽ gắn thông tin người dùng vào biến `req.user` và cho qua. Nếu sai/hết hạn, nó trả về lỗi 401. Nó **phải chạy trước** các middleware khác vì các middleware sau cần biết "ai đang yêu cầu".
- **`roleMiddleware.js`**: Trạm kiểm tra quyền admin. Nó nhìn vào `req.user.role` (đã được authMiddleware tạo ra). Nếu không phải `'admin'`, nó chặn lại (lỗi 403).
- **`filterExamMiddleware.js` (nếu có)**: Đôi khi việc truyền dữ liệu qua lại dạng JSON làm mất định dạng hoặc cần làm sạch (sanitize) trước khi chấm điểm. Đây là nơi giải quyết các vấn đề vòng tròn JSON hoặc lọc dữ liệu rác trước khi lưu vào DB.

## Thư mục `controllers/`
**Mục đích:** Nơi chứa "chất xám" (logic) để giải quyết một yêu cầu cụ thể.

- **`authController.js` (Đăng nhập, Đăng ký):**
  - *Đăng ký:* Nhận username, email, mật khẩu từ form. Bước 1: kiểm tra email đã tồn tại chưa. Bước 2: Băm (mã hóa) mật khẩu. Bước 3: Lưu vào Database.
  - *Đăng nhập:* Nhận email/mật khẩu. Bước 1: Tìm user bằng email. Bước 2: So sánh mật khẩu băm. Bước 3: Tạo thẻ JWT và gửi về cho người dùng.

- **`examController.js` (Lấy đề thi, Tạo đề):**
  - Chứa hàm gọi vào database để lấy ra đề thi. Nó sử dụng tính năng `populate` của mongoose để khi tìm Exam, nó kéo theo cả nội dung chi tiết của `ListeningSet`, `ReadingSet`... trả về chung 1 khối JSON khổng lồ cho giao diện hiển thị.

- **`resultController.js` (Chấm điểm và nộp bài):**
  - **Hàm `submitResult`**: Được kích hoạt khi học sinh nộp bài.
    - *Nó nhận:* Lời giải của học sinh, kỹ năng đang nộp (`skill`), và mã `sessionId`.
    - *Bước thực hiện:*
      1. Kiểm tra mã bài thi có tồn tại không.
      2. Nếu kỹ năng là Reading/Listening, nó lấy đáp án chuẩn từ Database ra và so sánh với đáp án của học sinh bằng thuật toán **so sánh chuỗi chính xác (strict case-sensitive/trim equality)**. *Tại sao?* Vì IELTS yêu cầu khắt khe về chính tả, dư dấu cách hoặc sai hoa/thường có thể tính là sai. Tuy nhiên có một số bước trim (cắt khoảng trắng 2 đầu) để tránh lỗi gõ nhầm.
      3. Nếu kỹ năng là Writing/Speaking, nó không tự chấm được (cần con người). Nó sẽ lưu bài nộp và đặt trạng thái là `GRADING` (chờ chấm).
      4. Lưu mọi thứ vào `ExamResult` kết nối chung với `sessionId`. *Tại sao có sessionId?* Vì học sinh có thể làm Listening hôm nay và Writing ngày mai, mã `sessionId` giúp nối các bài thi lẻ tẻ này thành một bảng điểm tổng (Overall) hoàn chỉnh.
    - *Nó trả về:* Mã kết quả vừa lưu.
  - **Hàm `gradeResult`**: Do Admin gọi để nhập điểm Writing/Speaking. Hàm sẽ cập nhật điểm, và tự động tính lại điểm `overallBand`. *Tại sao task 1 và task 2 có trọng số khác nhau?* Theo chuẩn IELTS, Writing Task 2 dài và khó hơn nên chiếm 2/3 tổng điểm phần viết, Task 1 chiếm 1/3. Logic tính trung bình được thiết kế riêng ở đây.

## Thư mục `routes/`
**Mục đích:** Gắn kết một URL với middleware và controller.
- Ví dụ: `router.post('/submit', authMiddleware, resultController.submitResult)`.
- Khi người dùng gửi yêu cầu tới `/submit`, hệ thống sẽ gọi `authMiddleware` trước, xong mới tới `submitResult`.

## Các Thiết kế Đáng chú ý
- **ID Câu hỏi (qId) liên tục:** Trong đề thi, các câu hỏi Listening thường đánh số từ 1 đến 40 xuyên suốt 4 Sections (không phải mỗi section bắt đầu lại từ 1). Do đó, `qId` trong mã nguồn được thiết kế thành một định danh liên tục để đảm bảo khi lưu đáp án, chấm điểm không bị nhầm lẫn giữa câu số 1 của Section 1 và câu số 1 của Section 2 (thực chất là không có câu số 1 ở Sec 2, mà bắt đầu từ 11).

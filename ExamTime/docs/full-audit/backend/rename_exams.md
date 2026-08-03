# backend/rename_exams.js

## Muc dich (1-2 cau)
File này là một script tiện ích (utility script) dùng một lần để sửa tên hàng loạt đề thi trong cơ sở dữ liệu. Cụ thể, nó xóa từ "Mock " (chứa dấu cách) ở đầu tên của tất cả các bài thi (ví dụ: đổi "Mock Test 01" thành "Test 01").

## Import / phu thuoc
- `mongoose`: Để kết nối và thao tác với MongoDB.
- `dotenv`: Để đọc chuỗi kết nối `MONGO_URI` từ file `.env`.
- `Exam`: Model của bộ đề thi để thực hiện truy vấn và cập nhật.

## Noi dung chi tiet
- `run()`: Hàm bất đồng bộ chứa toàn bộ logic.
  - Gọi `mongoose.connect()` để mở kết nối DB.
  - Sử dụng `Exam.find({})` để tải **toàn bộ** đề thi hiện có lên bộ nhớ (RAM).
  - Khởi tạo biến `count = 0` để đếm số lượng đề thi đã được sửa.
  - Duyệt qua từng `exam` bằng vòng lặp `for...of`:
    - Dùng hàm xử lý chuỗi `.startsWith('Mock ')` để kiểm tra tên.
    - Nếu có, dùng `.replace('Mock ', '')` để xóa từ đó đi.
    - Gọi `await exam.save()` để ghi lại thay đổi xuống Database, và tăng biến `count`.
  - In ra màn hình số lượng đề đã được cập nhật.
  - Bắt lỗi bằng `catch` (nếu có lỗi kết nối mạng hoặc lỗi DB).
  - Luôn luôn gọi `process.exit(0)` trong khối `finally` để ngắt tiến trình Node.js, tránh việc script bị treo (hang) do kết nối Mongoose vẫn đang mở.

## Duoc su dung boi (dependents)
- Chạy thủ công trên terminal: `node rename_exams.js`. Không được gọi bởi server.

## Diem dang chu y (neu co)
- **Hiệu năng cập nhật**: Logic tải toàn bộ collection `Exam` lên RAM (`find({})`) rồi lặp qua từng phần tử để `.save()` (phương pháp Active Record) rất dễ code nhưng lại kém tối ưu về mặt hiệu năng. Nếu DB có hàng chục ngàn bài thi, script này sẽ tốn rất nhiều RAM và thời gian. Cách chuẩn (Best Practice) trong MongoDB là sử dụng lệnh Update hàng loạt (Bulk Update) như `.updateMany({ title: /^Mock / }, ...)` để DB tự xử lý. Tuy nhiên, vì đây chỉ là script chạy 1 lần cho lượng dữ liệu nhỏ (vài chục đề thi), cách viết này là hoàn toàn có thể chấp nhận được.

# backend/sync_test02.js

## Muc dich (1-2 cau)
File này tương tự như `sync_test01.js`, là một script đồng bộ hóa dữ liệu từ file JSON cục bộ vào Database. Tuy nhiên, nó được hardcode để chỉ nhắm mục tiêu vào đề thi `TEST02` và chỉ cập nhật 2 kỹ năng là Listening và Reading (bỏ qua Writing và Speaking).

## Import / phu thuoc
- `fs/promises`: Đọc các file `listening.json`, `reading.json` và xử lý copy file audio.
- `mongoose`, `dotenv`: Kết nối Database.
- Các Model: `Exam`, `ListeningSet`, `ReadingSet`.

## Noi dung chi tiet
- `run()`: Hàm async chính.
  - Tìm bài thi có mã `TEST02`.
  - Nếu tìm thấy:
    1. **Listening**: Đọc nội dung `listening.json` trong thư mục `_processed/TEST02/`. Copy đè file audio từ thư mục xử lý sang thư mục `uploads/exams/` và đổi tên chuẩn hóa. Cập nhật `ListeningSet` trong DB bằng dữ liệu JSON mới đọc được.
    2. **Reading**: Đọc nội dung `reading.json` và cập nhật đè (overwrite) mảng `passages` của `ReadingSet` tương ứng trong DB.
  - In thông báo thành công và ngắt tiến trình bằng `process.exit(0)`.

## Duoc su dung boi (dependents)
- File chạy độc lập thông qua lệnh terminal `node sync_test02.js`. Không liên kết với server web chính.

## Diem dang chu y (neu co)
- Đây là một file "code rác" (technical debt) điển hình sinh ra trong quá trình debug gấp rút. Nó là bản sao chép (copy-paste) từ `sync_test01.js` nhưng bị cắt bớt chức năng (không sync Writing). Nếu dự án có hàng trăm đề thi, việc tạo từng file `sync_testXX.js` là không thể chấp nhận được. Cách giải quyết triệt để là viết một hàm truyền tham số động (ví dụ: `node sync_test.js TEST02`). Tương lai nên gỡ bỏ các file dạng này sau khi tính năng import chính thức ổn định.

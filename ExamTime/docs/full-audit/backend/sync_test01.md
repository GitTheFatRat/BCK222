# backend/sync_test01.js

## Muc dich (1-2 cau)
File này là một script đồng bộ hóa (sync script) dùng để ép (force) Database cập nhật lại nội dung của đề thi `TEST01` dựa trên các file JSON tĩnh đang nằm trong thư mục `exam-source-bank/_processed/TEST01/`. Hữu ích khi nội dung file JSON bị sửa bằng tay và muốn DB nhận các sửa đổi đó.

## Import / phu thuoc
- `fs/promises`: Đọc các file `listening.json`, `reading.json`, `writing.json` và copy file `mp3`.
- `mongoose`, `dotenv`: Kết nối Database.
- Các Model: `Exam`, `ListeningSet`, `ReadingSet`, `WritingSet`. (Lưu ý: Thiếu model `SpeakingSet` do lúc viết script tác giả chưa có nhu cầu sync kỹ năng nói).

## Noi dung chi tiet
- `run()`: Hàm async thực thi chính.
  - Tìm bài thi có `code: 'TEST01'`.
  - Nếu tìm thấy, thực hiện quá trình đồng bộ:
    1. **Listening**: Đọc `listening.json`. Với mỗi section, nó copy đè file audio từ `_processed` sang thư mục `uploads/exams/` và cập nhật lại đường dẫn URL. Sau đó update vào `ListeningSet` bằng hàm `findByIdAndUpdate`.
    2. **Reading**: Đọc `reading.json` và đè toàn bộ mảng `passages` vào `ReadingSet`.
    3. **Writing**: Đọc `writing.json` và đè `task1`, `task2` vào `WritingSet`.
  - Đóng tiến trình bằng `process.exit(0)`.

## Duoc su dung boi (dependents)
- File chạy độc lập thông qua lệnh `node sync_test01.js`.

## Diem dang chu y (neu co)
- File script này được viết theo hướng "chắp vá" (patch) để giải quyết nhanh sự cố chênh lệch dữ liệu giữa File và Database trong quá trình dev. Nó bỏ qua việc đồng bộ `SpeakingSet` và không cập nhật được cho các mã đề khác (bị hardcode `TEST01`). Nếu cần sync nhiều đề, admin nên dùng API `ingestExamFolder` thông thường (hoặc viết một script quét toàn bộ thư mục).

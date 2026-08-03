# backend/controllers/ingestController.js

## Muc dich (1-2 cau)
File này đảm nhiệm chức năng "Ingestion" (nhập liệu tự động). Nó đọc một thư mục chứa các file JSON và file âm thanh (đề thi chưa xử lý), kiểm tra tính hợp lệ của dữ liệu, chèn vào MongoDB, sao chép file âm thanh sang thư mục public, và cuối cùng dọn dẹp (di chuyển thư mục gốc sang trạng thái processed hoặc failed).

## Import / phu thuoc
- `import fs from 'fs/promises';` và `import path from 'path';`: Dùng để thao tác trực tiếp với hệ thống file (I/O) như đọc file JSON, kiểm tra thư mục, copy file audio, và di chuyển thư mục.
- Các Models (`Exam`, `ListeningSet`, `ReadingSet`, `WritingSet`, `SpeakingSet`): Để lưu dữ liệu đã parse vào cơ sở dữ liệu.

## Noi dung chi tiet
- **Các hằng số đường dẫn**: `SOURCE_BANK_DIR`, `PROCESSED_DIR`, `FAILED_DIR`, `UPLOADS_EXAMS_DIR` định nghĩa kiến trúc lưu trữ vật lý của bộ đề.
- **Hàm tiện ích (`ensureDir`, `readJsonFile`, `writeFailureLog`)**: Các hàm nhỏ giúp tạo thư mục nếu chưa có, đọc và parse JSON, hoặc ghi log lỗi ra file `error.txt` nếu quá trình import thất bại.
- **`ingestExamFolder(req, res)`**: Hàm xử lý chính.
  - Nhận `folderName` từ body của request.
  - Kiểm tra xem thư mục có tồn tại trong `exam-source-bank` không.
  - Đọc 5 file JSON cốt lõi: `manifest.json`, `listening.json`, `reading.json`, `writing.json`, `speaking.json`.
  - **Xử lý Audio Listening**: 
    - Duyệt qua từng section của listening. Tìm file audio tương ứng (vd `audio_1.mp3`).
    - Copy file audio từ source bank sang `uploads/exams/` và đổi tên thành `<mã-đề>_audio_<section>.mp3` để tránh trùng lặp. Cập nhật `audioUrl` lưu vào DB.
    - Validate (kiểm tra tính hợp lệ): Đảm bảo các `qId` trong Listening không bị trùng lặp (`seenQIds`) và phải là chuỗi liên tục tăng dần (vd Q1, Q2, Q3, không được nhảy cóc). Ném lỗi (throw Error) nếu vi phạm.
  - **BulkWrite Database**: Sử dụng `Promise.all` và lệnh `.bulkWrite([{ insertOne: ... }])` để chèn đồng thời 4 kỹ năng vào DB một cách hiệu quả nhất. Lấy ra các `insertedIds`.
  - Tạo bảng `Exam` nối 4 `insertedIds` này lại.
  - **Thành công**: Di chuyển toàn bộ thư mục vừa đọc sang `_processed` (`fs.rename`).
  - **Thất bại**: Bắt lỗi ở khối `catch`, ghi lỗi vào file `error.txt` và chuyển log vào thư mục `_failed`. Trả về `500`.

## Duoc su dung boi (dependents)
- `backend/routes/adminRoutes.js`: Cung cấp API `POST /api/admin/ingest` để quản trị viên có thể trigger quá trình nạp dữ liệu này.

## Diem dang chu y (neu co)
- **Quản lý Transaction lỏng lẻo**: Việc insert vào Database không nằm trong một MongoDB Session/Transaction. Nếu tạo `ListeningSet` thành công nhưng tạo `Exam` thất bại (chẳng hạn do lỗi mạng), dữ liệu rác (Orphaned Sets) sẽ bị lưu lại trong DB mà không được rollback. 
- Validation hiện tại khá tập trung vào Listening, còn các kỹ năng khác (Reading, Writing, Speaking) được import trực tiếp một cách mù quáng (blindly insert) mà chưa có bước kiểm tra chặt chẽ cấu trúc JSON. Nếu file JSON đầu vào bị sai cú pháp, lệnh `readJsonFile` sẽ lỗi ngay từ đầu, nhưng nếu sai cấu trúc schema, Mongoose sẽ văng lỗi lúc `bulkWrite`.

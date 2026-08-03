# backend/generate-tests.js

## Muc dich (1-2 cau)
File này là một script tự động hóa nhằm mục đích "nhân bản" (clone) đề thi. Cụ thể, nó lấy đề thi `CAMBRIDGE-19-TEST01` làm bản gốc, đổi tên thành `TEST01`, và sau đó copy ra thêm 9 bài test giả lập (từ `TEST02` đến `TEST10`) để làm phong phú dữ liệu hệ thống phục vụ mục đích kiểm thử và demo.

## Import / phu thuoc
- `fs/promises`, `path`: Xử lý I/O để đọc, ghi, copy và đổi tên file/thư mục.
- `mongoose`, `dotenv`: Kết nối Database và tải cấu hình.
- Các Model `Exam`, `ListeningSet`, `ReadingSet`, `WritingSet`, `SpeakingSet`: Để thực hiện các lệnh insert/update vào MongoDB.

## Noi dung chi tiet
- Hàm `run()` chạy tuần tự các bước:
  - **Bước 1: Đổi tên đề gốc**: Tìm bài thi có mã `CAMBRIDGE-19-TEST01`, đổi `code` thành `TEST01` và `title` thành `Test 01`. Sau đó tiến hành đổi tên tương ứng cho file audio trong thư mục `uploads/exams` và thư mục JSON trong `exam-source-bank/_processed/`. Cập nhật lại `audioUrl` trong database của bài nghe đó.
  - **Bước 2: Nạp dữ liệu nền**: Đọc 4 file JSON kỹ năng từ thư mục `TEST01` vừa đổi tên để lấy làm "khuôn mẫu" (base data).
  - **Bước 3: Vòng lặp nhân bản (Test 02 -> Test 10)**:
    - Vòng lặp `for (let i = 2; i <= 10; i++)`.
    - Sinh mã `testId` (ví dụ `TEST02`). Kiểm tra xem mã này đã có trong DB chưa, có rồi thì bỏ qua (idempotent - an toàn khi chạy nhiều lần).
    - Copy file audio từ `TEST01.mp3` sang `TEST02.mp3` v.v...
    - Xóa trường `_id` khỏi object dữ liệu mẫu (để Mongoose tự động tạo ObjectId mới, tránh lỗi trùng lặp key).
    - Cập nhật đường dẫn `audioUrl` cho phù hợp với từng mã bài thi.
    - Dùng `bulkWrite` chèn 4 kỹ năng mới vào 4 Collection tương ứng.
    - Tạo document `Exam` mới nối 4 kỹ năng vừa tạo.
    - Cuối cùng, tạo một thư mục mới trong `_processed/TESTxx/`, ghi lại 5 file JSON (gồm cả manifest) và copy thêm file `audio.mp3` gốc vào thư mục đó để đồng bộ hóa kho lưu trữ tĩnh với Database.

## Duoc su dung boi (dependents)
- Chạy độc lập bằng lệnh Node (`node generate-tests.js`).

## Diem dang chu y (neu co)
- **Tính năng hữu ích cho Development**: Kịch bản này rất tốt để populate (đổ) dữ liệu nhanh khi mới clone dự án về máy tính hoặc dựng server mới. Tuy nhiên, nội dung của cả 10 bài test thực chất đều y chang nhau (clone 100%), chỉ khác mỗi mã số. 
- Mọi lỗi vặt trong quá trình copy file audio đều bị "nuốt" (`catch (e) {}` trống ở dòng 139) để đảm bảo tiến trình không bị gián đoạn, điều này có thể gây khó khăn khi debug nếu ổ cứng đầy hoặc bị phân quyền sai.

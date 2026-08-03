# backend/seed_30_tests.js

## Muc dich (1-2 cau)
File này là một script tự động (seed script) dùng để sinh ra hàng loạt dữ liệu mẫu (mock data) cho ứng dụng. Cụ thể, nó dựa vào bài thi `TEST01` làm bản gốc để "đẻ" ra thêm 30 bài thi nữa (từ `TEST03` đến `TEST32`), giúp Developer/Tester có sẵn một lượng lớn data để kiểm tra UI (ví dụ như phân trang, hiển thị danh sách dài).

## Import / phu thuoc
- `fs/promises`: Đọc 4 file JSON của `TEST01` từ thư mục `exam-source-bank/_processed/TEST01`.
- `mongoose`, `dotenv`: Kết nối MongoDB.
- `Exam`, `ListeningSet`, `ReadingSet`, `WritingSet`, `SpeakingSet`: Các models để chèn dữ liệu.

## Noi dung chi tiet
- `run()`: Hàm async thực thi chính.
  - Tải dữ liệu JSON của `TEST01` vào bộ nhớ.
  - Gán cứng (hardcode) `audioUrl` cho các section nghe là trỏ về file âm thanh của `TEST01` (để không phải copy thêm 30 file mp3 nặng nề làm đầy ổ cứng).
  - Vòng lặp `for (let i = 3; i <= 32; i++)`:
    - Sinh mã và tiêu đề (ví dụ `TEST03`, `Test 03`).
    - Tìm xem mã này đã có trong DB chưa, nếu có rồi thì xóa (`Exam.deleteOne({ code })`) để ghi đè (Overwrite).
    - Tạo các bản ghi mới cho 4 kỹ năng trong DB dựa trên dữ liệu mẫu bằng `Model.create()`.
    - Nối 4 ID của kỹ năng vào model `Exam` và lưu lại với `isPublished: true`.
  - In log thành công và tắt process.

## Duoc su dung boi (dependents)
- Không có file nào import nó. Chỉ chạy thủ công bằng lệnh `node seed_30_tests.js`.

## Diem dang chu y (neu co)
- **Rác dữ liệu (Orphaned Documents)**: Khi ghi đè (dòng 44), script này chỉ xóa bản ghi trong collection `Exam` mà **không xóa** các document cũ của `ListeningSet`, `ReadingSet`... liên kết với nó. Điều này tạo ra rác trong Database (orphaned docs) ngày càng phình to nếu chạy đi chạy lại script nhiều lần. Tác giả cũng đã ý thức được điều này qua dòng comment *"(Ideally we also delete the old Sets... but for quick dev it's fine)"*.
- **Giống với `generate-tests.js`**: File này có chức năng gần như tương đồng với `generate-tests.js` (cũng là clone test), nhưng khác biệt ở chỗ nó không tạo ra các file thư mục tĩnh trong `_processed` và `uploads`, mà chỉ tập trung đổ (seed) dữ liệu trực tiếp vào MongoDB để test tốc độ và UI.

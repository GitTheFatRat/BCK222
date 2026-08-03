# backend/models/Exam.js

## Muc dich (1-2 cau)
File này định nghĩa schema và model cho một bài thi (Exam) hoàn chỉnh trong cơ sở dữ liệu MongoDB. Nó đóng vai trò là "gốc rễ" kết nối 4 kỹ năng (Listening, Reading, Writing, Speaking) lại thành một bộ đề thi duy nhất.

## Import / phu thuoc
- `import mongoose from "mongoose";`: Cần thiết để khởi tạo Schema và thao tác với MongoDB thông qua thư viện Mongoose.

## Noi dung chi tiet
- **`examSchema`**: Định nghĩa cấu trúc dữ liệu của một bài thi.
  - `title`: Tên hiển thị của bài thi (ví dụ: "Test 01"), bắt buộc (`required: true`) và tự động cắt khoảng trắng thừa (`trim: true`).
  - `code`: Mã định danh duy nhất của bài thi (ví dụ: "CAMBRIDGE-19-TEST01"). Bắt buộc, duy nhất (`unique: true`) và tự động chuyển thành chữ hoa (`uppercase: true`).
  - `listeningSet`, `readingSet`, `writingSet`, `speakingSet`: Đây là 4 trường tham chiếu (`ref`) tới các model tương ứng của từng kỹ năng. Thay vì nhúng toàn bộ dữ liệu câu hỏi vào đây, model này chỉ lưu trữ `ObjectId` để tham chiếu, giúp tối ưu hóa kích thước document và dễ dàng cập nhật độc lập từng phần.
  - `isPublished`: Cờ đánh dấu bài thi đã sẵn sàng hiển thị cho người dùng (frontend) hay chưa. Mặc định là `false`.
- **`{ timestamps: true }`**: Tự động sinh ra và quản lý 2 trường `createdAt` và `updatedAt`.
- **`export default mongoose.model('Exam', examSchema);`**: Xuất model ra để các file khác (controllers, scripts) có thể sử dụng để truy vấn hoặc cập nhật dữ liệu bảng `exams`.

## Duoc su dung boi (dependents)
Các file sau có import và sử dụng model `Exam`:
- `backend/controllers/examController.js`: Để lấy danh sách và chi tiết bài thi trả về cho client.
- `backend/controllers/ingestController.js`: Để tạo mới bài thi khi import dữ liệu từ JSON.
- `backend/controllers/resultController.js`: Để kiểm tra bài thi có tồn tại khi nộp bài và tính toán điểm.
- Các scripts hỗ trợ (seeds, sync, fix): `backend/seed_30_tests.js`, `backend/sync_test01.js`, `backend/sync_test02.js`, `backend/rename_exams.js`, `backend/generate-tests.js`, `backend/fix_listening.js`.

## Diem dang chu y (neu co)
- **Thiết kế cơ sở dữ liệu phân tán (Referencing over Embedding)**: Thay vì lưu hàng trăm câu hỏi trực tiếp vào model `Exam` (có thể gây vượt quá giới hạn 16MB của BSON document trong MongoDB), thiết kế này tách 4 kỹ năng ra 4 bảng riêng (`ListeningSet`, `ReadingSet`, v.v.) và chỉ lưu ObjectId. Do đó, khi cần hiển thị đầy đủ chi tiết bài thi, các truy vấn (queries) bắt buộc phải dùng lệnh `.populate('listeningSet').populate(...)` để kéo dữ liệu về.

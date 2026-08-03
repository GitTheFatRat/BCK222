# backend/controllers/examController.js

## Muc dich (1-2 cau)
File này xử lý các logic truy vấn liên quan đến bộ đề thi (Exam). Nhiệm vụ chính là lấy danh sách tất cả các đề thi hiện có, và lấy chi tiết nội dung của một bộ đề thi cụ thể dựa trên mã code của nó.

## Import / phu thuoc
- `import Exam from '../models/Exam.js';`: Import model chính `Exam` để tương tác với cơ sở dữ liệu MongoDB.

## Noi dung chi tiet
- **`getAllExams(req, res)`**: 
  - Truy vấn database để lấy ra tất cả các bài thi đã được xuất bản (`isPublished: true`).
  - Sử dụng `.select('title code createdAt')` để chỉ lấy đúng 3 trường thông tin cần thiết. Việc này giúp giảm thiểu băng thông (không gửi kèm dữ liệu chi tiết của từng đề thi), tối ưu hóa tốc độ tải trang cho màn hình danh sách đề (Home Dashboard).
- **`getExamByCode(req, res)`**:
  - Nhận `code` từ URL params (`req.params`).
  - Xử lý chuỗi code đầu vào: Loại bỏ khoảng trắng (`trim()`), và dùng Regex (Regular Expression) `new RegExp('^' + cleanCode + '$', 'i')` để tìm kiếm **không phân biệt hoa/thường** (case-insensitive).
  - Dùng chuỗi lệnh `.populate(...)` liên tiếp 4 lần cho `listeningSet`, `readingSet`, `writingSet`, `speakingSet`. Bước này cực kỳ quan trọng vì model `Exam` chỉ lưu ObjectId; lệnh `populate` sẽ yêu cầu Mongoose tự động lấy toàn bộ nội dung từ 4 bảng kỹ năng ghép vào kết quả trả về.
  - **Logic Fallback (Dự phòng lỗi định dạng mã)**: Nếu không tìm thấy đề thi với mã gốc (vd người dùng nhập "cambridge19test01"), nó sẽ dùng Regex thay thế `replace(/([a-zA-Z]+)(\d+)/g, '$1-$2')` để thử định dạng lại mã (chèn dấu gạch ngang, vd thành "cambridge-19test-01") và tìm kiếm lại lần 2.
  - Kiểm tra `!exam.isPublished`: Dù tìm thấy nhưng nếu đề thi chưa được public, vẫn trả về lỗi `404 Not Found`.
  - Cuối cùng trả về json của toàn bộ đề thi chi tiết.

## Duoc su dung boi (dependents)
- `backend/routes/examRoutes.js`: Gắn vào các endpoint `/api/exams` (GET) và `/api/exams/:code` (GET).

## Diem dang chu y (neu co)
- **Hiệu năng của Populate**: Truy vấn `getExamByCode` khá nặng do phải thực hiện 4 lệnh JOIN (thực chất MongoDB sẽ chạy thêm các query phụ ẩn bên dưới) để lấy đầy đủ data của 4 kỹ năng. Trong tương lai nếu hệ thống lớn, có thể cân nhắc việc thêm bộ đệm (Caching, ví dụ Redis) cho hàm này vì nội dung đề thi là tĩnh (ít thay đổi).
- Cơ chế Fallback Regex ở dòng 25 hơi "lỏng lẻo" (`$1-$2`) và có thể không bắt được hết các case sai định dạng của người dùng, nhưng đây là một workaround (giải pháp tạm thời) khá sáng tạo để tăng tính linh hoạt cho URL.

# backend/middlewares/filterExamMiddleware.js

## Muc dich (1-2 cau)
File này đóng vai trò là một bộ lọc bảo mật dữ liệu (data sanitization). Nhiệm vụ của nó là ẩn/xóa các đáp án và lời giải thích khỏi đề thi trước khi gửi xuống client nếu người dùng đang ở chế độ "Làm bài thi thực tế" (Exam Mode), nhằm ngăn chặn gian lận (inspect element/network).

## Import / phu thuoc
(Không có import bên ngoài, chỉ sử dụng các hàm thuần JavaScript).

## Noi dung chi tiet
- **`FIELDS_TO_STRIP`**: Mảng hằng số chứa danh sách các trường cần xóa, bao gồm `['correctAnswer', 'explanation']`.
- **`stripAnswerFields(data)`**: Một hàm đệ quy (recursive function) dùng để duyệt qua toàn bộ cấu trúc dữ liệu JSON lồng nhau phức tạp của bài thi.
  - Nếu `data` là mảng (Array), nó duyệt qua từng phần tử và gọi đệ quy.
  - Nếu `data` là một object (`data !== null && typeof data === 'object'`), nó tạo một bản clone (để không sửa đổi trực tiếp object gốc trong bộ nhớ của Node.js). Sau đó nó lặp qua `FIELDS_TO_STRIP` và xóa (`delete clone[field]`). Tiếp tục gọi đệ quy cho các thuộc tính con.
  - Trả về dữ liệu đã được làm sạch.
- **`filterExamMiddleware(req, res, next)`**: Middleware chặn và ghi đè hàm `res.json()`.
  - Nó sao lưu hàm `res.json` gốc vào `originalJson`.
  - Sau đó nó tự định nghĩa lại `res.json`:
    - Nếu có query string `?mode=exam` trên URL, nó sẽ bọc `payload` lại bằng cách ép kiểu qua `JSON.parse(JSON.stringify(payload))` (để dọn sạch các thuộc tính ngầm của Mongoose), sau đó ném vào hàm `stripAnswerFields` để xóa đáp án, rồi mới gửi qua `originalJson`.
    - Nếu không phải `mode=exam` (ví dụ `mode=practice` luyện tập, hoặc admin xem), nó trả về `payload` nguyên bản (có chứa đáp án).
  - `next()`: Tiếp tục xử lý request.

## Duoc su dung boi (dependents)
- `backend/routes/examRoutes.js`: Gắn trực tiếp vào route lấy chi tiết bài thi theo mã (`GET /:code`).

## Diem dang chu y (neu co)
- **Kỹ thuật Monkey-Patching (Ghi đè hàm gốc)**: Việc gán đè `res.json` là một kỹ thuật mạnh mẽ nhưng hơi nguy hiểm trong Express. Lợi ích là nó cho phép "can thiệp vào phút chót" ngay trước khi data bay khỏi server, mà không cần controller (`examController`) phải quan tâm đến logic này.
- Hàm đệ quy và `JSON.parse(JSON.stringify())` có thể gây tốn CPU nếu object quá lớn, tuy nhiên với kích thước một đề thi IELTS (dưới 100KB), mức phạt hiệu năng này là hoàn toàn chấp nhận được và xứng đáng để đổi lấy bảo mật.

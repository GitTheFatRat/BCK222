# backend/config/bandScale.json

## Muc dich (1-2 cau)
File này đóng vai trò như một cơ sở dữ liệu tĩnh (static database) chứa bảng quy đổi điểm (Band Score) của bài thi IELTS từ số câu trả lời đúng (Raw Score) sang điểm chuẩn (từ 1.0 đến 9.0) cho hai kỹ năng Listening và Reading (Academic).

## Import / phu thuoc
(Không có, đây chỉ là một file JSON dữ liệu thuần túy).

## Noi dung chi tiet
- File là một Object JSON với 2 key chính: `"listening"` và `"reading"`.
- Mỗi key chứa một mảng (Array) các quy tắc quy đổi điểm.
- Cấu trúc của mỗi quy tắc:
  - `"minCorrect"`: Số câu đúng tối thiểu để đạt mốc điểm này.
  - `"maxCorrect"`: Số câu đúng tối đa của mốc điểm này.
  - `"band"`: Điểm số tương ứng (ví dụ: 9.0, 8.5, 8.0).
- Ví dụ: Trong mảng `"reading"`, mốc điểm 8.0 yêu cầu thí sinh phải trả lời đúng từ 35 (`minCorrect`) đến 36 (`maxCorrect`) câu.
- **Lưu ý**: IELTS có 2 dạng bài thi là Academic (Học thuật) và General Training (Tổng quát). Thang điểm Reading của 2 dạng này khác nhau (GT cần nhiều câu đúng hơn để đạt cùng mức điểm). Bảng JSON hiện tại chỉ lưu trữ **duy nhất** thang điểm Academic.

## Duoc su dung boi (dependents)
- `backend/controllers/resultController.js`: File này dùng hàm `fs/promises.readFile` để đọc nội dung `bandScale.json` một lần duy nhất vào bộ nhớ khi server khởi động (hoặc khi có user nộp bài lần đầu tiên). Sau đó, nó dùng hàm `lookupBand()` duyệt qua mảng này để tự động chấm điểm cho phần thi Listening và Reading.

## Diem dang chu y (neu co)
- **Thiết kế dạng JSON tĩnh**: Thay vì lưu bảng quy đổi này vào Database (MongoDB), tác giả lưu vào một file JSON. Điều này hợp lý vì thang điểm IELTS là chuẩn quốc tế, rất hiếm khi thay đổi. Việc đọc từ file JSON giúp tiết kiệm một câu truy vấn DB mỗi khi chấm điểm.
- **Biến thể (Variants)**: Như đã nói ở trên, hệ thống hiện chưa hỗ trợ thang điểm cho dạng thi General Training. Nếu dự án muốn mở rộng để hỗ trợ bài thi GT, file JSON này sẽ cần phải sửa đổi thành `{"listening": [...], "reading-academic": [...], "reading-general": [...]}`.

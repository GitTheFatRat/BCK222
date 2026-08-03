# backend/models/ListeningSet.js

## Muc dich (1-2 cau)
File này định nghĩa schema và model cho phần thi Listening của một bài kiểm tra IELTS. Nó cấu trúc dữ liệu theo từng phần (section/part), mỗi phần đi kèm với một file âm thanh và một danh sách các câu hỏi liên quan.

## Import / phu thuoc
- `import mongoose from 'mongoose';`: Để định nghĩa các Schema con (Subdocuments) và Model chính cho MongoDB.

## Noi dung chi tiet
- **`questionSchema`**: Định nghĩa cấu trúc cho một câu hỏi đơn lẻ.
  - `qId`: Mã định danh câu hỏi (thường là "Q1", "Q2"). Bắt buộc.
  - `type`: Loại câu hỏi, bị giới hạn bởi enum (`gap-fill`, `multiple-choice`, `true-false-notgiven`, `matching`).
  - `prompt`: Nội dung câu hỏi/yêu cầu.
  - `options`: Mảng các chuỗi, dành cho các câu hỏi trắc nghiệm hoặc nối từ (chứa các lựa chọn A, B, C...).
  - `correctAnswer`: Kiểu `Mixed`, vì đáp án đúng có thể là một chuỗi (ví dụ: "A"), hoặc mảng các chuỗi (nếu có nhiều đáp án được chấp nhận như "color" và "colour").
  - `explanation`: Chuỗi giải thích lý do tại sao đáp án lại đúng (hiển thị khi xem kết quả chi tiết).
  - `{ _id: false }`: Tắt tính năng tự động tạo `_id` của Mongoose cho từng câu hỏi để giảm kích thước database (vì `qId` đã đóng vai trò định danh).
- **`sectionSchema`**: Định nghĩa cấu trúc cho một phần thi nghe (Section 1, 2, 3, 4).
  - `sectionNumber`: Số thứ tự của phần thi.
  - `audioUrl`: Đường dẫn tới file âm thanh (`.mp3`) tương ứng cho phần thi này.
  - `questions`: Mảng chứa các câu hỏi thuộc `questionSchema`.
  - `{ _id: false }`: Tương tự, tắt tự động tạo `_id` cho subdocument này.
- **`listeningSetSchema`**: Schema chính chứa mảng các `sections`. Đi kèm `{ timestamps: true }` để theo dõi thời gian tạo/cập nhật.
- **`export default mongoose.model('ListeningSet', listeningSetSchema);`**: Xuất model ra để sử dụng trong các tác vụ lưu trữ và truy vấn.

## Duoc su dung boi (dependents)
- `backend/controllers/ingestController.js`: Để parse JSON và lưu trữ vào database khi tạo bài thi mới.
- `backend/controllers/resultController.js`: Dùng để tra cứu `correctAnswer` khi chấm điểm tự động lúc user nộp bài Listening.
- Các scripts hỗ trợ: `backend/sync_test01.js`, `backend/sync_test02.js`, `backend/seed_30_tests.js`, `backend/generate-tests.js`, `backend/fix_listening.js`. (Ghi chú: Model `Exam` dùng tham chiếu `ref: 'ListeningSet'` thông qua tên string, không import file này trực tiếp).

## Diem dang chu y (neu co)
- **Kiểu dữ liệu `Mixed` cho `correctAnswer`**: Nhờ dùng Mixed, hệ thống có thể hỗ trợ đáp án nhiều lựa chọn (mảng) đối với câu hỏi dạng điền từ (gap-fill), cho phép linh hoạt trong logic chấm tự động (ví dụ script chấm sẽ kiểm tra nếu câu trả lời của user nằm trong mảng `correctAnswer`).
- Việc nhóm audio theo `section` rất chuẩn xác với format IELTS thi trên máy tính, nơi người dùng chuyển đổi qua lại giữa các Part và nghe audio riêng của Part đó.

# backend/models/ReadingSet.js

## Muc dich (1-2 cau)
File này định nghĩa schema và model cho phần thi Reading. Nó tổ chức dữ liệu thành các bài đọc (passage) riêng biệt, mỗi bài đọc chứa văn bản và danh sách các câu hỏi đi kèm.

## Import / phu thuoc
- `import mongoose from 'mongoose';`: Để sử dụng Schema và tạo model, thiết lập cấu trúc cho collection `readingsets` trong MongoDB.

## Noi dung chi tiet
- **`questionSchema`**: Cấu trúc của một câu hỏi Reading, gần như giống hệt `ListeningSet`'s `questionSchema`.
  - `qId`: Mã câu hỏi (vd: "Q14").
  - `type`: Phân loại câu hỏi (`gap-fill`, `multiple-choice`, `true-false-notgiven`, `matching`).
  - `prompt`: Câu hỏi hoặc chỉ dẫn.
  - `options`: Các lựa chọn (A, B, C...) nếu là câu trắc nghiệm/nối.
  - `correctAnswer`: Kiểu `Mixed`, hỗ trợ đáp án chuỗi hoặc mảng (nhiều đáp án đúng/nhiều lựa chọn).
  - `explanation`: Giải thích đáp án chi tiết.
  - Tắt `_id` mặc định (`{ _id: false }`) để tránh rác database.
- **`passageSchema`**: Cấu trúc của một đoạn văn (Passage).
  - `passageNumber`: Số thứ tự của đoạn văn (thường từ 1 đến 3).
  - `title`: Tiêu đề của đoạn văn.
  - `text`: Nội dung HTML hoặc chuỗi văn bản của đoạn văn.
  - `questions`: Mảng chứa các câu hỏi thuộc `questionSchema`.
  - Tắt `_id` mặc định.
- **`readingSetSchema`**: Schema gốc chứa mảng các `passages` và được đánh dấu thời gian `timestamps`.
- **`export default mongoose.model('ReadingSet', readingSetSchema);`**: Xuất model.

## Duoc su dung boi (dependents)
- `backend/controllers/ingestController.js`: Tạo model `ReadingSet` từ JSON khi thêm đề thi.
- `backend/controllers/resultController.js`: Chấm điểm tự động dựa vào trường `correctAnswer`.
- Scripts: `backend/sync_test01.js`, `backend/sync_test02.js`, `backend/seed_30_tests.js`, `backend/generate-tests.js`.

## Diem dang chu y (neu co)
- **Tính đồng nhất**: Thiết kế của `ReadingSet` và `ListeningSet` cực kỳ tương đồng trong phần `questionSchema`, điều này giúp việc viết chung một hàm chấm điểm (grading logic) cho cả Reading và Listening trong `resultController` trở nên dễ dàng và ít lỗi hơn.
- Nội dung văn bản (`text`) của đoạn văn trong thực tế thường chứa mã HTML (các thẻ `<p>`, `<strong>`) để có thể hiển thị phong phú trên giao diện người dùng, do đó frontend phải dùng cơ chế render an toàn (như `dangerouslySetInnerHTML`).

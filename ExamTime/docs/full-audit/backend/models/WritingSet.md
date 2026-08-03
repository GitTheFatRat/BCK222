# backend/models/WritingSet.js

## Muc dich (1-2 cau)
File này định nghĩa schema và model cho phần thi Writing của bài thi IELTS. Nó chia dữ liệu rõ ràng thành 2 task riêng biệt (Task 1 và Task 2) với các ràng buộc về giới hạn từ vựng và nội dung đề bài.

## Import / phu thuoc
- `import mongoose from 'mongoose';`: Thư viện cơ bản để tạo Schema và kết nối với MongoDB.

## Noi dung chi tiet
- **`writingSetSchema`**: Schema định nghĩa cấu trúc dữ liệu cho một bộ đề Writing. Bao gồm 2 phần chính:
  - `task1`: Chứa dữ liệu của IELTS Writing Task 1 (thường là mô tả biểu đồ, bản đồ).
    - `prompt`: Yêu cầu đề bài (chuỗi văn bản, bắt buộc).
    - `imageUrl`: Đường dẫn tới hình ảnh biểu đồ/bản đồ đính kèm (có thể không có nếu là dạng đề khác, nhưng thường là có trong Task 1 Academic).
    - `minWords`: Số từ tối thiểu yêu cầu (mặc định là 150 từ theo chuẩn IELTS).
  - `task2`: Chứa dữ liệu của IELTS Writing Task 2 (thường là bài luận nghị luận).
    - `prompt`: Đề bài luận (chuỗi văn bản, bắt buộc).
    - `imageUrl`: Có thể có (tuy hiếm ở Task 2 nhưng model vẫn chừa sẵn).
    - `minWords`: Số từ tối thiểu yêu cầu (mặc định là 250 từ theo chuẩn IELTS).
- Đi kèm `{ timestamps: true }`.
- **`export default mongoose.model('WritingSet', writingSetSchema);`**: Xuất model.

## Duoc su dung boi (dependents)
- `backend/controllers/ingestController.js`: Tạo model `WritingSet` từ file JSON `writing.json` khi import bộ đề.
- Scripts: `backend/seed_30_tests.js`, `backend/sync_test01.js`, `backend/generate-tests.js`.

## Diem dang chu y (neu co)
- **Tối giản hóa**: Khác với bài thi Listening/Reading có hàng chục câu hỏi, WritingSet chỉ lưu trữ nội dung "Đề thi". Phần bài làm của thí sinh sẽ được lưu ở `ExamResult.js` (`writingTask1Text` và `writingTask2Text`), đảm bảo model gốc của đề thi không bị phình to theo thời gian và giữ được tính bất biến (immutable).
- Trường `imageUrl` thường sẽ lưu đường dẫn tương đối (ví dụ `/uploads/exams/TEST01_task1.png`), do đó frontend sẽ cần cấu hình prefix gốc (như `import.meta.env.VITE_API_URL`) để render ảnh chính xác.

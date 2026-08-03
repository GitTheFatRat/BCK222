# backend/models/SpeakingSet.js

## Muc dich (1-2 cau)
File này định nghĩa schema và model cho phần thi Speaking của IELTS. Do tính chất thi nói không có câu hỏi trắc nghiệm hay điền từ, dữ liệu chỉ đơn giản là các câu hỏi gợi ý và nội dung thẻ gợi ý (cue card).

## Import / phu thuoc
- `import mongoose from 'mongoose';`: Để thiết lập Schema lưu trữ vào collection `speakingsets` trong MongoDB.

## Noi dung chi tiet
- **`speakingSchema`**: Phản ánh cấu trúc 3 phần của bài thi IELTS Speaking chuẩn:
  - `part1`: Mảng các câu hỏi chuỗi (String) dùng để phỏng vấn ngắn gọn ở phần 1.
  - `part2`: Dành riêng cho phần độc thoại (Monologue).
    - `cueCard`: Nội dung chủ đề trên thẻ gợi ý (vd: "Describe a person you admire...").
    - `prepSeconds`: Thời gian chuẩn bị, mặc định là 60 giây (1 phút).
    - `talkSeconds`: Thời gian nói tối đa, mặc định là 120 giây (2 phút).
  - `part3`: Mảng các câu hỏi chuỗi (String) để thảo luận sâu hơn dựa trên chủ đề ở part 2.
- Đi kèm với `{ timestamps: true }` để Mongoose quản lý `createdAt` và `updatedAt`.
- **`export default mongoose.model('SpeakingSet', speakingSchema);`**: Xuất model.

## Duoc su dung boi (dependents)
- `backend/controllers/ingestController.js`: Tạo model `SpeakingSet` từ file JSON `speaking.json` khi import bộ đề.
- Scripts: `backend/seed_30_tests.js`, `backend/generate-tests.js`.

## Diem dang chu y (neu co)
- **Sự đơn giản**: Khác với Listening/Reading (có logic chấm điểm tự động), Speaking (và Writing) chỉ đóng vai trò cung cấp đề (prompt). Phần logic ghi âm (`speakingRecordingUrl`) và điểm số (`speakingBand`) hoàn toàn thuộc trách nhiệm của file `ExamResult.js`. Do đó schema này rất gọn nhẹ và ít phức tạp.

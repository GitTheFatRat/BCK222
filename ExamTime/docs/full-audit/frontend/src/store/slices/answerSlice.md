# frontend/src/store/slices/answerSlice.js

## Muc dich (1-2 cau)
File này định nghĩa một Redux Slice chịu trách nhiệm quản lý toàn bộ dữ liệu bài làm của người dùng trong phòng thi. Nó lưu trữ câu trả lời trắc nghiệm/điền từ, nội dung bài luận Writing, và đường dẫn tạm (Blob URL) của file ghi âm Speaking.

## Import / phu thuoc
- `createSlice` từ `@reduxjs/toolkit`: Hàm tiện ích để tự động sinh ra các Action Creators và Reducer dựa trên cấu hình.

## Noi dung chi tiet
- **`initialState`**: Trạng thái mặc định ban đầu khi chưa làm bài.
  - `byQuestionId: {}`: Một object (dictionary) lưu đáp án của kỹ năng Listening và Reading dưới dạng key-value, ví dụ: `{ "Q1": "apple", "Q2": "B" }`. Thiết kế dạng Object (thay vì mảng) giúp truy xuất và cập nhật đáp án theo `qId` với độ phức tạp O(1) cực kỳ nhanh.
  - `writingTask1`, `writingTask2`: Chuỗi văn bản rỗng để hứng bài viết.
  - `speakingRecordingBlobUrl`: Gán bằng `null`. Sẽ chứa đường dẫn tới file âm thanh tạm thời trên RAM của trình duyệt (Blob) sau khi user bấm dừng ghi âm.
- **`reducers`**:
  - `setAnswer`: Hàm nhận `qId` và `value` để cập nhật đáp án cho Listening/Reading.
  - `setWritingContent`: Hàm nhận `task` (Task1 hoặc Task2) và `content` để cập nhật nội dung bài viết.
  - `setSpeakingRecording`: Gắn Blob URL vào state.
  - `clearAnswer`: Xóa hẳn một đáp án khỏi object `byQuestionId`.
  - `resetAnswers`: Trả state về lại `initialState`. Rất quan trọng khi user bắt đầu một bài thi mới hoặc chuyển đổi giữa các môn, giúp dọn sạch bài làm cũ.
- Export các action (`setAnswer`, `resetAnswers`...) để các component gọi thông qua `useDispatch`.
- Export mặc định hàm `reducer` để gắn vào `store/index.js`.

## Duoc su dung boi (dependents)
- Component giao diện phòng thi:
  - `ListeningForm`, `ReadingSplit`: Gọi `setAnswer` mỗi khi user gõ vào ô input hoặc chọn radio button.
  - `WritingEditor`: Gọi `setWritingContent`.
  - `SpeakingRecorder`: Gọi `setSpeakingRecording`.
  - `ExamRoom`: Gọi `resetAnswers` khi component mount (khởi tạo phòng thi).
- `store/index.js`: Mount reducer vào global state dưới cái tên `state.answers`.

## Diem dang chu y (neu co)
- Slice này chỉ lưu dữ liệu tạm trên RAM. Nếu user tải lại trang (F5) trong lúc đang làm bài, toàn bộ biến Redux sẽ bị xóa trắng và mất bài. Trong tương lai, để hệ thống hoàn thiện hơn, có thể tích hợp `redux-persist` hoặc lưu thủ công `state.answers` xuống `localStorage` sau mỗi cú click để chống mất dữ liệu.

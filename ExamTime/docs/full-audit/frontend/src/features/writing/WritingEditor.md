# frontend/src/features/writing/WritingEditor.jsx

## Muc dich (1-2 cau)
File này cung cấp giao diện soạn thảo văn bản (Editor) cho phần thi Writing. Nó bao gồm khung nhập liệu, bộ đếm số chữ (Word Count) tự động, và vùng hiển thị hình ảnh minh họa (ví dụ: biểu đồ cho Task 1).

## Import / phu thuoc
- `useMemo` từ `react`.
- `useDispatch`, `useSelector` từ `react-redux`.
- `setWritingContent` từ `../../store/slices/answerSlice`: Action lưu bài viết lên Redux.
- `getMediaUrl` từ `../../config/media.js`: Để parse đường dẫn ảnh.

## Noi dung chi tiet
- Component nhận các props: `task` ("Task1" hoặc "Task2"), `minWords` (số từ tối thiểu, thường là 150 cho Task 1 và 250 cho Task 2), `prompt` (đề bài), và `imageUrl` (đường dẫn ảnh biểu đồ).
- **Kết nối Redux**:
  - Dựa vào prop `task`, xác định `stateKey` (`writingTask1` hay `writingTask2`).
  - Lấy nội dung hiện tại từ `state.answers[stateKey]`.
  - Hàm `handleChange(e)`: Gọi dispatch để cập nhật nội dung bài viết mỗi khi user gõ phím.
- **Tính toán Word Count (`useMemo`)**:
  - Tách chuỗi theo khoảng trắng (`content.trim().split(/\s+/)`) để đếm số từ hiện tại. Sử dụng `useMemo` giúp hàm này chỉ chạy lại khi `content` thay đổi, tối ưu hiệu năng.
  - Biến `isBelowMin`: Trả về `true` nếu số từ hiện tại nhỏ hơn `minWords`.
- **Phần Render (UI)**:
  - Nếu có `prompt` hoặc `imageUrl`, hiển thị lên trên cùng. Dùng `getMediaUrl` để biến đổi đường dẫn tương đối thành tuyệt đối.
  - Thẻ `<textarea>` lớn (20 dòng) để thí sinh gõ bài.
  - Thẻ hiển thị Word Count ở dưới cùng: Nếu `isBelowMin` là true, nó sẽ đổi màu đỏ (nhờ class `warning`) và hiện dòng nhắc nhở *"Need X more words to meet the minimum"*.

## Duoc su dung boi (dependents)
- `frontend/src/pages/PracticeRoom.jsx` và `ExamRoom.jsx`: Dùng để hiển thị khu vực làm bài thi Writing Task 1 và Task 2.

## Diem dang chu y (neu co)
- Logic đếm từ sử dụng Regex `/\s+/` khá chuẩn để tách khoảng trắng liên tiếp, nhưng sẽ đếm sai nếu user gõ các dấu chấm phẩy dính liền nhau (ví dụ `word1,word2` sẽ bị đếm là 1 từ). Đây là một điểm có thể nâng cấp trong tương lai (bổ sung tách theo dấu câu).
- Khác với `ListeningForm`, thẻ `<textarea>` ở đây không hỗ trợ chấm điểm tự động (showAnswers = false), vì bài viết luận không thể chấm bằng máy theo cách truyền thống. Nó đòi hỏi giáo viên (Admin) phải chấm tay thông qua màn hình Grading.

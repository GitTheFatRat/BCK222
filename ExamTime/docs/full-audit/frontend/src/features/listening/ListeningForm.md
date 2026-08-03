# frontend/src/features/listening/ListeningForm.jsx

## Muc dich (1-2 cau)
File này định nghĩa giao diện biểu mẫu nhập đáp án (Form) chuyên dụng cho phần thi Listening. Nó hiển thị danh sách câu hỏi kèm theo các ô điền từ (input text) hoặc các nút chọn (radio buttons), đồng thời có khả năng tự động bôi đỏ/xanh (chấm điểm trực tiếp) nếu đang ở chế độ xem đáp án.

## Import / phu thuoc
- `useDispatch`, `useSelector` từ `react-redux`.
- `setAnswer` từ `../../store/slices/answerSlice.js`: Action cập nhật đáp án lên Redux mỗi khi user gõ phím.

## Noi dung chi tiet
- Component nhận 2 props:
  - `questions`: Mảng chứa danh sách câu hỏi (được bóc tách từ `examData` trả về bởi backend).
  - `showAnswers`: Cờ (boolean) quyết định xem có được hiển thị đáp án đúng và giải thích hay không. (Ví dụ: đang luyện tập (practice) thì `true`, đang thi (exam) thì `false`).
- Kết nối Redux:
  - Hàm `handleChange(qId, value)`: Gọi dispatch để đẩy chữ thí sinh vừa gõ lên Store.
  - Đọc `state.answers.byQuestionId` để biết hiện tại thí sinh đã điền gì vào ô này (cơ chế Controlled Component của React).
- Vòng lặp `questions.map`:
  - Mỗi câu hỏi được bọc trong một `div.question-block`. Component hỗ trợ render giao diện khác nhau tùy vào loại câu hỏi (`question.type`):
    - `multiple-choice`: Hiển thị danh sách thẻ `input type="radio"` dọc xuống.
    - `true-false-notgiven`: Sinh ra 3 nút radio tương ứng (TRUE, FALSE, NOT GIVEN).
    - `gap-fill` (điền từ) và `matching` (nối từ): Hiển thị một ô `input type="text"`.
  - **Chế độ hiển thị đáp án (`showAnswers = true`)**:
    - Nếu thí sinh chọn đúng (`currentAnswer === question.correctAnswer`), thẻ div được gắn thêm class `is-correct` (tô viền xanh). Ngược lại là `is-wrong` (tô viền đỏ).
    - Thẻ `div.answer-feedback` sẽ xuất hiện ở dưới cùng của câu hỏi đó để tiết lộ đáp án đúng (`correctAnswer`) và dòng giải thích (`explanation`) lý do chọn đáp án đó.

## Duoc su dung boi (dependents)
- `frontend/src/pages/PracticeRoom.jsx` và `ExamRoom.jsx`: Để hiển thị phần thi Listening.
- `frontend/src/features/reading/ReadingSplit.jsx`: **Rất thú vị!** Thay vì tạo ra một `ReadingForm` riêng, màn hình thi Reading (đọc hiểu) lại đang "tái sử dụng" (reuse) nguyên xi component `ListeningForm` này làm nơi nhập đáp án, vì bản chất các dạng câu hỏi của IELTS Reading và Listening khá giống nhau (đều là điền từ, trắc nghiệm, T/F/NG).

## Diem dang chu y (neu co)
- Đây là một trong những file "nặng đô" nhất về mặt Logic UI của Frontend vì nó phải xử lý đa dạng các loại câu hỏi khác nhau của IELTS.
- Việc `ReadingSplit` sử dụng lại `ListeningForm` là một pha tái sử dụng code tốt, tuy nhiên tên gọi `ListeningForm` lúc này lại trở nên không chính xác (vì nó đang phục vụ cả Reading). Một tên gọi hợp lý hơn (nếu có dự định refactor) sẽ là `QuestionForm` hoặc `AssessmentForm`.

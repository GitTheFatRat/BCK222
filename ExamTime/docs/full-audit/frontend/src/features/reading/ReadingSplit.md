# frontend/src/features/reading/ReadingSplit.jsx

## Muc dich (1-2 cau)
File này định nghĩa giao diện chia đôi màn hình (Split View) đặc trưng của phần thi Reading. Một nửa bên trái dùng để đọc đoạn văn bản (Passage), nửa bên phải chứa các câu hỏi tương ứng với đoạn văn đó.

## Import / phu thuoc
- `ListeningForm` từ `../listening/ListeningForm.jsx`: Dùng để tái sử dụng giao diện nhập đáp án.

## Noi dung chi tiet
- Component nhận prop `passage` (chứa dữ liệu của một bài đọc, gồm tiêu đề `title`, nội dung `text`, và mảng các câu hỏi `questions`) và prop `showAnswers`.
- Cấu trúc HTML trả về:
  - Bọc ngoài là thẻ `<div className="reading-split">`.
  - **Khối văn bản (Left Pane - `.passage-pane`)**: 
    - Hiển thị thẻ `<h3>` cho tiêu đề bài đọc.
    - Dùng `.split('\n')` cắt nội dung bài đọc thành một mảng các đoạn văn (paragraphs) dựa trên ký tự xuống dòng.
    - Dùng `.map` bọc mỗi đoạn văn đó vào một thẻ `<p>` để văn bản được dàn trải đẹp mắt, có khoảng cách rõ ràng thay vì dính liền một cục.
  - **Khối câu hỏi (Right Pane - `.questions-pane`)**:
    - Thay vì phải code lại từ đầu các thẻ `input/radio`, component này gọi ngay `<ListeningForm questions={passage.questions} showAnswers={showAnswers} />`. Việc này tái sử dụng 100% logic Redux và giao diện chấm điểm đã viết sẵn ở bên phần Listening.

## Duoc su dung boi (dependents)
- `frontend/src/pages/PracticeRoom.jsx` và `ExamRoom.jsx`: Dùng để hiển thị bài thi Reading. Do bài thi Reading thường có 3 phần (Passage 1, 2, 3), component này sẽ được gọi (render) lại 3 lần cho mỗi bài đọc đó.

## Diem dang chu y (neu co)
- **Tối ưu UI/UX**: Kiến trúc chia đôi màn hình là chuẩn mực (industry standard) cho thi tiếng Anh trên máy tính. Nó giúp học viên không phải cuộn lên cuộn xuống liên tục giữa đoạn văn và câu hỏi.
- Trong `components.css`, `.reading-split` thường được cài đặt hiển thị dạng Grid hoặc Flexbox (`display: flex`) với tỷ lệ 50-50 để tạo ra 2 cột song song.

# backend/fix_listening.js

## Muc dich (1-2 cau)
File này là một đoạn script dùng một lần (one-off script) hoặc tiện ích chạy thủ công để sửa lỗi thiếu dữ liệu trong phần thi Listening. Nó nhân bản Section 1 thành 4 Sections cho cả Database và các file JSON đã lưu, nhằm đảm bảo đề thi đủ 40 câu theo chuẩn IELTS nếu lúc nạp (ingest) bị thiếu.

## Import / phu thuoc
- `fs/promises`, `path`: Thao tác với file JSON trong ổ cứng.
- `mongoose`, `dotenv`: Kết nối Database và đọc cấu hình biến môi trường.
- `ListeningSet`, `Exam`: Các Model Mongoose để truy vấn.

## Noi dung chi tiet
- `run()`: Hàm async chính.
  - Kết nối DB.
  - Lấy tất cả bài thi (`Exam.find({})`).
  - **Sửa dữ liệu DB**: 
    - Với mỗi bài thi, lấy ra `ListeningSet`.
    - Nếu bài thi này chỉ có đúng 1 section (`set.sections.length === 1`), script sẽ giả định là bị thiếu 3 section còn lại.
    - Nó copy `section1` thành `section2`, gán `sectionNumber = 2` và sửa tất cả mã câu hỏi (`qId`) thành `Q11` -> `Q20`.
    - Làm tương tự cho `section3` (`Q21` -> `Q30`) và `section4` (`Q31` -> `Q40`).
    - Gán lại mảng 4 sections vào `set.sections` và `.save()`.
  - **Sửa dữ liệu File**:
    - Tiếp tục mở file JSON lưu trong `exam-source-bank/_processed/<exam-code>/listening.json`.
    - Đọc file bằng `fs.readFile`, parse JSON, và lặp lại y chang quá trình nhân bản 4 section như trên.
    - Dùng `fs.writeFile` để ghi đè lại file.
  - Thoát chương trình `process.exit(0)` khi hoàn tất.

## Duoc su dung boi (dependents)
- File này không được import ở đâu cả. Nó được chạy độc lập thông qua terminal (ví dụ: `node fix_listening.js`) khi quản trị viên phát hiện đề thi bị lỗi thiếu section.

## Diem dang chu y (neu co)
- **Hardcode và Rủi ro dữ liệu**: Script này giải quyết vấn đề bằng cách nhân bản nội dung (copy/paste y chang section 1). Điều này giúp ứng dụng không bị lỗi (không bị crash do thiếu câu hỏi), nhưng về mặt dữ liệu thì nội dung bài thi sẽ bị sai (người dùng làm 4 phần giống hệt nhau). Nó có vẻ giống một script sinh dữ liệu giả (mock data) hơn là sửa lỗi thực sự. Cần cẩn trọng khi chạy trên Production.

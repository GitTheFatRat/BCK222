# Hướng dẫn Frontend (Frontend Walkthrough)

Tài liệu này giải thích cách tổ chức và hoạt động của phần giao diện (Frontend) viết bằng thư viện React.

## Khái niệm Cốt lõi: Redux là gì?
Trong React, dữ liệu (gọi là *state*) thường truyền từ component cha xuống component con giống như thác nước (qua *props*). Nhưng nếu giao diện có một cái Thanh điều hướng (Navbar) ở tuốt trên cùng, và một trang Hồ sơ (Profile) ở tuốt bên dưới, việc truyền dữ liệu Người dùng qua 10 tầng thác nước rất mệt mỏi. 
**Redux** ra đời như một "Đám mây dữ liệu toàn cục" (Store). Bất kỳ component nào, dù ở đâu, cũng có thể với tay lên mây để lấy thông tin Người dùng hoặc cập nhật nó mà không cần truyền qua các tầng trung gian.

## Thư mục `src/store/` (Redux Slices)
**Mục đích:** Chứa các mẩu dữ liệu trên "đám mây" Redux.
- Mỗi tính năng sẽ có một "Slice" (lát cắt) riêng. Ví dụ: `authSlice.js` quản lý việc người dùng đã đăng nhập hay chưa; `examSlice.js` quản lý thời gian làm bài, đề thi đang mở, các câu trả lời học sinh đã nhập.
- Khi người dùng gõ phím vào ô đáp án, giao diện sẽ gửi một "Hành động" (Action) lên Redux. Redux sẽ chạy một "Bộ xử lý" (Reducer) để cập nhật đáp án mới vào mây.

## Thư mục `src/services/`
**Mục đích:** Bưu điện kết nối với Backend.
- React không tự lấy dữ liệu từ mạng được. Thư mục này chứa các file (như `api.js` hoặc `examService.js`) sử dụng thư viện gọi mạng (như `axios` hoặc `fetch`) để đóng gói dữ liệu và gửi tới cổng `:5000` của Backend.
- Nó cũng tự động nhét "Vòng tay JWT" vào mỗi yêu cầu trước khi gửi đi.

## Thư mục `src/components/`
**Mục đích:** Các "viên gạch" xây dựng giao diện.
- Đây là các nút bấm (Button), ô nhập chữ (Input), cửa sổ báo lỗi (Modal) có thể dùng đi dùng lại ở nhiều trang khác nhau. Chúng "ngu ngốc" - tức là không tự biết lấy dữ liệu mạng, chỉ nhận lệnh và vẽ ra màn hình.

## Thư mục `src/features/`
**Mục đích:** Các cụm chức năng phức tạp, cụ thể cho nghiệp vụ thi.
- Khác với `components`, thư mục này chứa các cụm lớn tự biết nói chuyện với Redux hoặc Services.
- **Ví dụ `speaking/SpeakingRecorder.jsx`:** Nó hiển thị một máy ghi âm. Nó cần truy cập micro (thông qua API của trình duyệt web), lưu trữ tệp âm thanh nháp trên bộ nhớ máy, sau đó nén lại và gửi lên Backend khi bấm nộp.
- **Thủ thuật "Mount lại" ở `AudioPlayer`:** Trong tính năng Nghe (Listening), có một file xử lý phát âm thanh. Khi học sinh chuyển từ Phần 1 sang Phần 2, file âm thanh phải đổi. Thay vì phải viết code phức tạp để dừng file cũ, xóa file, tải file mới, người lập trình dùng một thủ thuật React gọi là `key={currentSectionIndex}`. Trong React, khi giá trị `key` thay đổi, nó sẽ "đập đi xây lại" hoàn toàn component đó. Điều này ép trình duyệt web dọn sạch âm thanh cũ và khởi tạo lại máy phát âm thanh từ đầu một cách an toàn và gọn gàng!

## Thư mục `src/pages/`
**Mục đích:** Các trang chính.
- Ví dụ `HomePage.jsx` hay `ExamPage.jsx`. Chúng đóng vai trò là kiến trúc sư, xếp các "viên gạch" (components) và "cụm chức năng" (features) vào đúng vị trí trên một màn hình hiển thị.

## React Hook là gì?
Các trang và component thường dùng những hàm có chữ `use` ở đầu (ví dụ: `useState`, `useEffect`). Đó là **Hooks**.
- `useState`: Cái túi nhớ tạm. Giúp component nhớ xem nút này đã được bấm hay chưa.
- `useEffect`: Cái đồng hồ báo thức. Giúp component biết "Hãy tự động chạy hàm này ngay khi vừa mới hiện lên màn hình" (ví dụ: gọi API tải đề thi ngay khi vừa vào trang).

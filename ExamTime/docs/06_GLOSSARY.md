# Từ Điển Thuật Ngữ (Glossary)

Tài liệu này giải thích các thuật ngữ kỹ thuật khó hiểu bằng ngôn ngữ bình dân.

- **JWT (JSON Web Token)**: Giống như một cái Vòng Tay Giấy VIP ở khu vui chơi. Sau khi bạn xuất trình chứng minh thư (đăng nhập) lần đầu, hệ thống cấp cho bạn vòng tay này. Ở những lần chơi trò chơi sau (gửi yêu cầu), bạn chỉ cần giơ vòng tay ra, không cần lấy chứng minh thư nữa.
- **Middleware**: Giống như bác bảo vệ đứng trước cửa phòng giám đốc. Bất cứ yêu cầu nào gửi tới máy chủ đều phải qua tay bác bảo vệ kiểm tra trước (xem có mang vũ khí không, có đeo Vòng Tay VIP không). Nếu ổn mới cho vào gặp bộ phận xử lý chính.
- **ObjectId**: Là một chuỗi 24 chữ số và chữ cái ngẫu nhiên (ví dụ `64a7...`) do cơ sở dữ liệu tạo ra để làm số Chứng minh nhân dân duy nhất cho một món dữ liệu (Ví dụ tài khoản người dùng, hay một bài thi).
- **Mongoose Schema**: Là bản thiết kế khuôn đúc dữ liệu. Nó quy định chặt chẽ: "Tên người dùng phải là chữ (String) và không được để trống", ngăn chặn việc người ta cố tình lưu số hoặc hình ảnh vào trường tên người dùng.
- **Redux (Store/Slice/Action/Reducer)**: 
  - **Store**: Cái tủ thuốc dùng chung của cả bệnh viện (ứng dụng Frontend).
  - **Slice**: Một ngăn cụ thể trong tủ thuốc (ví dụ ngăn chuyên để thuốc Cảm).
  - **Action**: Tờ giấy y lệnh của bác sĩ báo "hãy lấy thuốc".
  - **Reducer**: Người dược sĩ mở tủ thuốc, đọc y lệnh và thay đổi số lượng thuốc trong tủ.
- **React Hook**: Các công cụ (bắt đầu bằng chữ `use` như `useState`) giúp các mảnh giao diện (Component) có khả năng ghi nhớ thông tin hoặc biết khi nào nên tự động chạy một đoạn mã. Giống như gắn thêm đồng hồ báo thức hay não bộ vào một cục gạch.
- **FormData**: Là một dạng đóng gói dữ liệu y hệt như việc bạn đóng gói một cái thùng carton để gửi bưu điện. Rất hữu dụng khi bạn cần gửi kèm "vật thể nặng" như file ghi âm (mp3) hay hình ảnh, thay vì chỉ gửi chữ thông thường.
- **CORS (Cross-Origin Resource Sharing)**: Một hàng rào an ninh của trình duyệt web. Nếu trang web của bạn nằm ở nhà `localhost:5173`, mà máy chủ lấy dữ liệu lại nằm ở nhà `localhost:5000`, trình duyệt sẽ chặn lại vì nghi ngờ trộm cắp. Bạn phải xin phép (cấu hình CORS) để hai nhà này được nói chuyện với nhau.
- **Environment Variable (Biến môi trường)**: Những bí mật không được viết thẳng vào code (như mật khẩu kết nối cơ sở dữ liệu). Chúng được lưu trong một file `.env` giấu kín trên máy chủ, giống như cái chìa khóa két sắt cất dưới gầm giường.
- **REST API / Endpoint**:
  - **REST API**: Là sổ tay quy tắc giao tiếp giữa Frontend và Backend.
  - **Endpoint**: Giống như cửa sổ giao dịch của ngân hàng. Cửa `/api/auth/login` chuyên lo đăng nhập, cửa `/api/exam/submit` chuyên lo nộp bài.
- **Populate (trong Mongoose)**: Động tác "nhổ củ cải kéo theo bùn". Nếu bài thi chỉ chứa mã của đề bài nghe (ObjectId), khi gọi tính năng Populate, máy chủ sẽ tự động lặn xuống cơ sở dữ liệu, nhặt luôn chi tiết cái đề bài nghe đó lên và trả về nguyên cục cho bạn.
- **Embedded vs Referenced Document**: 
  - **Embedded**: Lồng nhau như Búp bê Nga. Câu hỏi nằm gọn bên trong Bài Đọc.
  - **Referenced**: Ghi địa chỉ nhà. Bài Thi không chứa sẵn Bài Đọc, mà chỉ ghi "Hãy sang nhà số 5 đường ABC để lấy Bài Đọc".
- **JSON (JavaScript Object Notation)**: Một định dạng văn bản dùng để gửi dữ liệu qua mạng, nhìn rất giống một danh sách các cặp Chìa-Khóa: `"tên": "Nguyễn Văn A", "tuổi": 18`.
- **Async/Await**: Giống như đi mua cà phê. Bạn đặt món (gọi mạng) và đứng sang một bên lướt điện thoại chờ (Await) cho tới khi nhân viên làm xong, thay vì đứng chắn ngay quầy làm những người phía sau phải đứng đợi (khóa luồng hoạt động).

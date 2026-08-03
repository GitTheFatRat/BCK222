# Tổng quan Kiến trúc (Architecture Overview)

Dự án ExamTime được chia thành 3 phần chính hoạt động cùng nhau để tạo ra một hệ thống hoàn chỉnh. Dưới đây là sơ đồ kiến trúc tổng quan:

```text
+-----------------------+         HTTP / REST API          +-----------------------+
|   Browser (Trình duyệt)| <==============================> |    Express Backend    |
|   (React Frontend)    |         (JSON Data)              |    (Node.js server)   |
|   Chạy trên Cổng 5173 |                                  |    Chạy trên Cổng 5000|
+-----------------------+                                  +-----------------------+
                                                                       ^
                                                                       |
                                                               Mongoose / MongoDB
                                                                       |
                                                                       v
                                                           +-----------------------+
                                                           |     MongoDB Atlas     |
                                                           |    (Cloud Database)   |
                                                           +-----------------------+
```

## Các Tầng (Layers) Hoạt động Ra sao?

1. **Browser (React frontend)**: Đây là phần giao diện mà người dùng nhìn thấy và tương tác (nút bấm, form, trình phát âm thanh). Nó chạy trên máy tính của người dùng (trình duyệt). Nó không biết cách lưu dữ liệu lâu dài, mà chỉ hiển thị dữ liệu và gửi yêu cầu (request) đi.
2. **Express Backend**: Đây là "bộ não" nghiệp vụ (business logic). Nó chạy trên một máy chủ (server). Nó nhận yêu cầu từ Frontend (như "chấm điểm bài này cho tôi"), tính toán, kiểm tra xem người dùng có được phép làm vậy không, và nói chuyện với Database.
3. **MongoDB Atlas (Cloud database)**: Đây là "nhà kho" lưu trữ thông tin lâu dài (tài khoản người dùng, câu hỏi, điểm thi). Nó là một dịch vụ đám mây.

**Tại sao lại chia tách như vậy (Tại sao không gộp chung vào 1 chương trình lớn)?**
- **Sự chuyên biệt (Separation of concerns)**: Frontend tập trung làm đẹp và mượt giao diện, Backend tập trung tính toán an toàn.
- **Khả năng mở rộng (Scalability)**: Nếu có quá nhiều người dùng, ta có thể mua thêm máy chủ cho Backend mà không cần đụng đến Frontend.
- **Bảo mật**: Người dùng chỉ có quyền tải Frontend về máy. Mã nguồn tính điểm hay kết nối cơ sở dữ liệu nằm an toàn trên máy chủ Backend.

---

## Cấu trúc Thư mục

### Backend (`backend/`)
- `config/` — Chứa các tệp thiết lập hệ thống như kết nối với cơ sở dữ liệu.
- `controllers/` — Chứa các hàm xử lý logic cốt lõi cho từng tính năng (ví dụ: tính điểm, đăng nhập).
- `middlewares/` — Các "người gác cổng" chặn giữa request và controller để kiểm tra quyền hạn hoặc chỉnh sửa dữ liệu.
- `models/` — Định nghĩa cấu trúc dữ liệu sẽ được lưu vào MongoDB (ví dụ: User trông như thế nào).
- `routes/` — Bản đồ hướng dẫn: URL nào (ví dụ `/api/login`) sẽ đi vào controller nào.
- `exam-source-bank/` — Thư mục chứa các tệp dữ liệu đề thi thô để admin có thể tự động nạp vào hệ thống.
- `uploads/` — Nơi lưu trữ các tệp vật lý do người dùng tải lên, như file ghi âm phần Speaking.

### Frontend (`frontend/src/`)
- `components/` — Các mảnh ghép giao diện nhỏ có thể dùng lại nhiều lần (nút bấm, ô nhập chữ).
- `config/` — Chứa cấu hình kết nối API (URL của backend).
- `features/` — Chứa các tính năng phức tạp, chuyên biệt (ví dụ: phần thi Speaking, phần thi Listening).
- `pages/` — Các trang toàn màn hình kết hợp nhiều component và features lại với nhau (ví dụ: Trang chủ, Trang làm bài).
- `services/` — Chứa các đoạn mã chuyên gọi API gửi/nhận dữ liệu với Backend.
- `store/` — Chứa bộ nhớ toàn cục (Redux) để lưu trữ trạng thái của ứng dụng (ví dụ: thông tin người dùng đang đăng nhập).
- `mock/` — Chứa dữ liệu giả (fake data) dùng để kiểm thử giao diện khi chưa có Backend.

---

## Xác thực JWT là gì?

**JWT (JSON Web Token)** là cách mà ứng dụng nhớ được bạn là ai sau khi bạn đăng nhập. 

**Giải thích đơn giản:**
Hãy tưởng tượng bạn đi xem ca nhạc. Lúc mua vé (đăng nhập), bạn đưa chứng minh thư và vé cho bảo vệ kiểm tra (Backend kiểm tra email và mật khẩu). Nếu đúng, bảo vệ không bắt bạn cầm chứng minh thư đi khắp nơi, mà đeo cho bạn một cái **Vòng tay giấy** (chính là JWT). Từ lúc đó, mỗi khi bạn muốn mua nước hay vào khu vực VIP, bạn chỉ cần giơ cái Vòng tay ra. 

**Tại sao ứng dụng dùng JWT?**
Bởi vì web hoạt động theo cơ chế "không trạng thái" (stateless). Nghĩa là mỗi lần bạn tải lại trang (reload) hoặc bấm qua trang khác, máy chủ sẽ "quên" bạn ngay lập tức. Bằng cách lưu JWT trong trình duyệt và gửi kèm JWT vào mỗi yêu cầu tiếp theo, máy chủ sẽ nhìn vào "vòng tay" và biết "À, đây là người dùng tên A, không cần bắt họ nhập mật khẩu lại nữa".

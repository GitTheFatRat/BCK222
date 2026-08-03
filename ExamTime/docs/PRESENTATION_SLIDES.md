# 📊 CẤU TRÚC 11 SLIDE THUYẾT TRÌNH BẢO VỆ DỰ ÁN EXAMTIME

> **Gợi ý cách làm:** Bạn có thể dùng **PowerPoint**, **Canva** hoặc **Google Slides**. Mỗi slide dưới đây tương ứng với 1 trang. Chữ in đậm là tiêu đề, bullet point là các gạch đầu dòng đưa lên slide, phần "💬 Lời thoại" là kịch bản để bạn đứng nói (đừng viết lời thoại lên slide nhé).

---

## 🖥️ Slide 1: Tiêu đề (Title Slide)
- **Tiêu đề lớn:** EXAMTIME – Hệ thống Luyện thi và Thi thử IELTS trực tuyến
- **Tiêu đề phụ:** Báo cáo đồ án môn học / Đồ án tốt nghiệp
- **Thông tin sinh viên:** Tên của bạn - Mã sinh viên
- **Giảng viên hướng dẫn:** (Tên thầy/cô)

> 💬 **Lời thoại:** *"Kính chào hội đồng giám khảo. Hôm nay em xin phép trình bày về dự án ExamTime - một hệ thống ứng dụng web hỗ trợ luyện thi và đánh giá năng lực IELTS toàn diện."*

---

## 🎯 Slide 2: Giới thiệu dự án & Vấn đề giải quyết (Overview)
- **ExamTime là gì?** Nền tảng thi thử IELTS mô phỏng kỳ thi trên máy tính (Computer-delivered IELTS).
- **Vấn đề giải quyết:**
  - Học viên khó tìm nền tảng thi thử có chấm điểm tự động.
  - Giáo viên vất vả trong việc giao bài và quản lý kết quả thủ công.
- **Mục tiêu:** Tự động hóa chấm điểm (Reading/Listening), số hóa thi (Writing/Speaking) và tích hợp giám sát.

> 💬 **Lời thoại:** *"Lý do em làm dự án này là vì hiện nay học viên rất cần môi trường thi thử trên máy tính giống thi thật, đồng thời hỗ trợ giáo viên chấm bài dễ dàng hơn. ExamTime ra đời để giải quyết bài toán đó."*

---

## 📝 Slide 3: Các phân hệ bài thi (Types of ExamTime)
*(Giống như slide hình ảnh bạn đang làm, bạn có thể bổ sung chi tiết sau)*
- **Reading:** Mô phỏng giao diện chia đôi màn hình (đề bài bên trái, câu trả lời bên phải).
- **Listening:** Tích hợp Audio Player, chặn tua hoặc tải về khi ở chế độ thi thật.
- **Writing:** Text Editor hỗ trợ đếm từ (word count) theo thời gian thực và kiểm tra số từ tối thiểu.
- **Speaking:** Cho phép thu âm trực tiếp qua Micro trên trình duyệt (MediaRecorder API) và nộp bài.

> 💬 **Lời thoại:** *"Hệ thống hỗ trợ đầy đủ 4 phân hệ của IELTS. Reading và Listening được mô phỏng giống thi thật. Điểm nổi bật là Writing có tự động đếm từ, và Speaking cho phép thí sinh thu âm trực tiếp trên web mà không cần dùng phần mềm bên ngoài."*

---

## 🛠️ Slide 4: Công nghệ sử dụng (Tech Stack)
- **Frontend:** ReactJS 19, Redux Toolkit, Vite, CSS thuần (tối ưu hiệu năng).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Cloud NoSQL) qua thư viện Mongoose.
- **Bảo mật & Tính năng phụ:** JWT (JSON Web Token), bcryptjs, Multer (xử lý audio upload).

*(Chèn các logo: React, Vite, Nodejs, MongoDB vào slide này)*

> 💬 **Lời thoại:** *"Về công nghệ, em sử dụng stack hiện đại. React và Vite cho frontend để tối ưu tốc độ, Node.js cho backend và MongoDB làm cơ sở dữ liệu linh hoạt."*

---

## 🏗️ Slide 5: Kiến trúc hệ thống (System Architecture)
*(Chèn **Sơ đồ 1 (System Architecture)** từ file DIAGRAMS.md vào đây)*
- **Mô hình Client - Server**
- Giao tiếp qua **RESTful API** (JSON / FormData cho Audio).
- Phân tách rõ ràng: Frontend quản lý giao diện, Backend xử lý logic, DB lưu trữ.

> 💬 **Lời thoại:** *"Đây là kiến trúc tổng quan. Trình duyệt React sẽ gọi các API RESTful tới máy chủ Node.js. Máy chủ xác thực qua Middleware, xử lý bằng Controller và lưu xuống MongoDB."*

---

## 🎨 Slide 6: Frontend - Giao diện & Trải nghiệm (ReactJS)
- **Kiến trúc:** 100% Functional Components & React Hooks.
- **Quản lý trạng thái (Global State):** Redux Toolkit (quản lý Auth, Exam Session, Answers).
- **Bảo mật Route:** Dynamic Routing & Route Guards (Bảo vệ đường dẫn Admin và Phòng thi).
- **Tính năng đặc biệt:** State Persistence (Lưu trạng thái thi bằng localStorage để chống mất dữ liệu khi rớt mạng).

> 💬 **Lời thoại:** *"Ở phía Frontend, em tự hào nhất là việc quản lý trạng thái bài thi bằng Redux kết hợp LocalStorage. Nhờ đó, nếu thí sinh lỡ F5 hoặc tắt máy, bài làm và thời gian đếm ngược vẫn được khôi phục."*

---

## ⚙️ Slide 7: Backend - Logic Cốt lõi (Node.js)
- **Kiến trúc:** Chuẩn **MVC** (Model - View - Controller).
- **Bảo mật:**
  - Xác thực JWT (Token sống 7 ngày).
  - Băm mật khẩu (bcrypt 10 rounds).
- **Middleware thông minh:** Phân quyền (Auth/Admin/Role), lọc dữ liệu (ẩn đáp án khi thi thật), xử lý Upload Audio (Multer).
- **Tối ưu hiệu năng:** Dùng `Promise.all` xử lý ghi DB song song.

> 💬 **Lời thoại:** *"Về Backend, hệ thống thiết kế chuẩn MVC. Em xây dựng các lớp Middleware gác cổng chặt chẽ, từ kiểm tra đăng nhập đến chặn thí sinh xem trộm đáp án khi đang làm bài."*

---

## 🗄️ Slide 8: Cơ sở dữ liệu (MongoDB)
*(Chèn **Sơ đồ 2 (Database ERD)** vào đây)*
- **Lý do chọn MongoDB:** Cấu trúc đề thi IELTS phức tạp, dùng NoSQL dạng JSON tự nhiên và truy vấn nhanh hơn SQL.
- **6 Collections chính:** Users, Exams, ExamResults, ListeningSets, ReadingSets, Writing/SpeakingSets.
- **Quan hệ:** 1-n (User - Kết quả) và 1-1 (Đề thi - Bộ kỹ năng).

> 💬 **Lời thoại:** *"Do đề thi IELTS có cấu trúc lồng nhau phức tạp, em chọn MongoDB. Sơ đồ này thể hiện quan hệ một-nhiều giữa User và Kết quả thi, cùng quan hệ một-một giữa 1 Đề thi với 4 module kỹ năng."*

---

## ✨ Slide 9: Điểm nhấn 1 - Luồng chấm điểm kết hợp
*(Chèn **Sơ đồ 10 (Band Score Calculation)** vào đây)*
- **Listening & Reading (Tự động):** Chấm trực tiếp trên server → So khớp đáp án → Đếm câu đúng → Tra bảng Band Score (`bandScale.json`).
- **Writing & Speaking (Thủ công):** Thu thập Text và Audio blob → Upload qua FormData → Chờ Admin/Giáo viên chấm điểm.
- **Tính Overall:** Tự động tính trung bình cộng 4 kỹ năng.

> 💬 **Lời thoại:** *"Tính năng cốt lõi nhất là luồng chấm điểm. Nghe-Đọc được máy tự động chấm và quy đổi sang band IELTS ngay lập tức. Viết-Nói sẽ được lưu trữ kèm file ghi âm để giáo viên chấm tay trên trang Admin, sau đó hệ thống tự động tổng hợp điểm Overall."*

---

## 🕵️‍♂️ Slide 10: Điểm nhấn 2 - Phát hiện gian lận (Anti-cheating)
*(Chèn **Sơ đồ 11 (Anti-Cheating Flow)** vào đây)*
- **Cơ chế:** Bắt sự kiện `visibilitychange` của trình duyệt.
- **Hoạt động:** Khi thí sinh chuyển tab để tra từ điển hoặc đổi cửa sổ phần mềm khác → Hệ thống ngầm ghi lại `timestamp` và lưu vào Redux.
- **Kết quả:** Báo cáo gian lận được gửi lên trang Admin để giáo viên theo dõi.

> 💬 **Lời thoại:** *"Để đảm bảo tính công bằng, em xây dựng tính năng chống gian lận. Hệ thống lắng nghe sự kiện của trình duyệt; mỗi khi thí sinh chuyển tab sang trang khác, hệ thống sẽ log lại thời gian và báo cáo cho giám thị."*

---

## 🚀 Slide 11: Tổng kết & Định hướng phát triển
- **Đạt được:** Xây dựng thành công nền tảng thi thử 4 kỹ năng mượt mà, chuẩn MVC, bảo mật tốt.
- **Định hướng tương lai:**
  - Ứng dụng AI/ChatGPT API để tự động chấm điểm Writing và Speaking.
  - Thêm tính năng phòng thi nhiều người cùng lúc (Real-time bằng Socket.io).
- **Lời cảm ơn:** *(Ghi lời cảm ơn đến thầy cô và hội đồng)*.

> 💬 **Lời thoại:** *"Nhìn chung dự án đã đáp ứng tốt yêu cầu. Nếu có thêm thời gian, em sẽ tích hợp AI để tự động chấm điểm Speaking và Writing. Cảm ơn quý thầy cô đã lắng nghe phần trình bày của em!"*

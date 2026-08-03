# BÍ KÍP TRẢ LỜI PHỎNG VẤN THEO TIÊU CHÍ ĐÁNH GIÁ (RUBRIC)

## PHẦN 1: BACKEND (NODE.JS & EXPRESS & MONGODB)

### Mức Cơ bản (4 điểm)

Câu 1: "Hiểu biết cơ bản về Node.js và npm: Biết cách cài đặt và sử dụng các gói npm."
Dấu hiệu 1:
```json
// package.json
"dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.3.2",
    "cors": "^2.8.5"
}
```
Dấu hiệu 2:
Nằm trong file `package.json`, nó quản lý các thư viện do npm tải về. Đóng vai trò làm danh sách khai báo các công cụ bên ngoài cần thiết để chạy dự án.

Câu 2: "Cài đặt và cấu hình Express.js cơ bản: Khởi tạo một ứng dụng Express đơn giản."
Dấu hiệu 1:
```javascript
// server.js
import express from 'express';
const app = express();
app.listen(5000, () => {
    console.log('Server running');
});
```
Dấu hiệu 2:
Sử dụng hàm `express()` để khởi tạo web server và `app.listen()` để lắng nghe ở cổng 5000. Đóng vai trò làm khung xương chính của backend.

Câu 3: "Xử lý các tuyến đường cơ bản (routing): Có thể xử lý các yêu cầu GET và POST đơn giản."
Dấu hiệu 1:
```javascript
// routes/authRoutes.js
const router = Router();
router.post('/login', login);
router.get('/me', getMe);
```
Dấu hiệu 2:
Dùng hàm `router.post` hoặc `router.get` để đón đầu các request API. Nó đóng vai trò phân luồng giao thông, đẩy đúng request vào đúng controller để xử lý.

Câu 4: "Hiểu biết cơ bản về middleware: Có thể sử dụng được middleware, hiểu cách hoạt động khác với controller."
Dấu hiệu 1:
```javascript
// server.js
app.use(express.json());
app.use(cors());
```
Dấu hiệu 2:
Lệnh `app.use` gọi các middleware chạy trước khi nhảy vào controller. Nó đóng vai trò như chốt kiểm duyệt (ví dụ tự động biến dữ liệu client gửi thành dạng JSON) đứng giữa Request và Controller.

Câu 5: "Thiết kế cơ sở dữ liệu cơ bản: Hiểu mô hình quan hệ, thiết kế bảng (1-n, n-n)."
Dấu hiệu 1:
```javascript
// models/Result.js
const resultSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }
});
```
Dấu hiệu 2:
Khai báo trường `ref: 'User'` trong Schema. Đóng vai trò tạo sợi dây liên kết khóa ngoại (Foreign Key) thể hiện quan hệ 1-N (Một User có nhiều Result) giữa các bảng trong MongoDB.

Câu 6: "Truy vấn cơ bản: Viết các truy vấn cơ bản."
Dấu hiệu 1:
```javascript
// controllers/authController.js
const user = await User.findOne({ email });
```
Dấu hiệu 2:
Gọi lệnh `findOne` thông qua Mongoose Model. Đóng vai trò chui vào CSDL MongoDB để tìm kiếm, đọc, hoặc ghi dữ liệu.

### Mức Trung bình (7 điểm)

Câu 7: "Xử lý tuyến đường nâng cao: Xử lý PUT, DELETE và tham số trên đường dẫn."
Dấu hiệu 1:
```javascript
// routes/examRoutes.js
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);
```
Dấu hiệu 2:
Sử dụng cú pháp `/:id` trên URL để bắt động ID tham số. Đóng vai trò cung cấp cách để Update (PUT) hoặc Xóa (DELETE) một dòng dữ liệu cụ thể trong CSDL.

Câu 8: "Sử dụng middleware phức tạp: validation, convert data file, auth."
Dấu hiệu 1:
```javascript
// middleware/auth.js
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    // verify token...
    next();
};
```
Dấu hiệu 2:
Một hàm middleware tự viết có tham số `next`. Đóng vai trò xác thực bảo vệ route, nếu token xịn thì gọi `next()` cho đi tiếp, nếu giả mạo thì chặn lại ngay lập tức.

Câu 9: "Kết nối cơ sở dữ liệu MongoDB và thực hiện CRUD cơ bản."
Dấu hiệu 1:
```javascript
// config/db.js
await mongoose.connect(process.env.MONGODB_URI);
```
Dấu hiệu 2:
Sử dụng `mongoose.connect` cùng chuỗi kết nối. Đóng vai trò mở một đường ống kết nối trực tiếp từ Backend lên máy chủ Database (MongoDB Atlas hoặc local).

Câu 10: "Quản lý lỗi: Xử lý các lỗi và phản hồi cho client."
Dấu hiệu 1:
```javascript
// server.js
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'Lỗi server.' });
});
```
Dấu hiệu 2:
Middleware đặc biệt nằm ở cuối cùng của app với 4 tham số `(err, req, res, next)`. Nó đóng vai trò như phễu hứng mọi lỗi văng ra trong code và trả về dạng JSON an toàn cho Client.

### Mức Nâng cao (10 điểm)

Câu 11: "Bảo mật ứng dụng: Áp dụng HTTPS, JWT, OAuth."
Dấu hiệu 1:
```javascript
// controllers/authController.js
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
```
Dấu hiệu 2:
Sử dụng thư viện `jsonwebtoken`. Đóng vai trò tạo ra một tấm thẻ phi bài mã hóa chứa thông tin user, giúp server xác thực mà không cần lưu phiên đăng nhập (session) vào bộ nhớ.

Câu 12: "Kiến trúc MVC, RESTful API."
Dấu hiệu 1:
```text
GET /api/exams
POST /api/exams
PUT /api/exams/:id
```
Dấu hiệu 2:
Dự án được chia thư mục rõ ràng `models/`, `controllers/`, `routes/` và dùng chung 1 URL `/api/exams` với các phương thức khác nhau. Đóng vai trò tuân thủ chuẩn thiết kế REST giúp API mạch lạc, chuẩn mực.

---

## PHẦN 2: FRONTEND (REACTJS)

### Mức Cơ bản (4 điểm)

Câu 13: "Cấu trúc component và JSX: Khai báo và sử dụng JSX để render."
Dấu hiệu 1:
```jsx
// pages/Login.jsx
export default function Login() {
    return <div className="login-page">...</div>;
}
```
Dấu hiệu 2:
Viết HTML lồng thẳng vào trong hàm Javascript (JSX). Đóng vai trò tạo ra giao diện trực quan và cho phép chia nhỏ màn hình thành các mảnh Component dễ tái sử dụng.

Câu 14: "Components và Props: Truyền dữ liệu từ component cha xuống con."
Dấu hiệu 1:
```jsx
// Ở file cha
<ExamCard exam={examData} />

// Ở file con
function ExamCard({ exam }) { ... }
```
Dấu hiệu 2:
Truyền giá trị thông qua attribute như HTML thông thường. Đóng vai trò vận chuyển dữ liệu một chiều từ component bọc ngoài vào component bên trong để hiển thị.

Câu 15: "Xử lý sự kiện: onClick, onChange, onSubmit."
Dấu hiệu 1:
```jsx
<form onSubmit={handleSubmit}>
    <input onChange={handleChange} />
    <button type="submit">Đăng nhập</button>
</form>
```
Dấu hiệu 2:
Gắn trực tiếp sự kiện vào các thẻ thông qua camelCase. Đóng vai trò lắng nghe hành động tương tác (chuột, bàn phím) của User để kích hoạt các hàm xử lý logic.

Câu 16: "Rendering Lists và Keys: Dùng vòng lặp và đặt keys."
Dấu hiệu 1:
```jsx
{exams.map(exam => (
    <ExamCard key={exam._id} exam={exam} />
))}
```
Dấu hiệu 2:
Dùng hàm `.map()` để lặp mảng tạo danh sách và gắn `key`. Thuộc tính `key` đóng vai trò đánh dấu ID độc nhất giúp React nhận diện cực nhanh phần tử nào bị xóa/sửa để vẽ lại màn hình mà không bị lag.

Câu 17: "Form và controlled components: value và onChange liên kết state."
Dấu hiệu 1:
```jsx
<input value={form.email} onChange={handleChange} />
```
Dấu hiệu 2:
Thuộc tính `value` bị khóa cứng vào biến state của React. Đóng vai trò tước quyền tự nhớ chữ của thẻ input HTML, ép nó phải hiển thị mọi thứ theo dữ liệu trung tâm (State) của React quản lý.

### Mức Trung bình (7 điểm)

Câu 18: "Hooks (useState, useEffect): Quản lý state và side effects."
Dấu hiệu 1:
```jsx
const [form, setForm] = useState({ email: '' });
useEffect(() => {
    fetchData();
}, []);
```
Dấu hiệu 2:
Sử dụng các hàm Hook cốt lõi. `useState` đóng vai trò là "bộ não" ghi nhớ dữ liệu tạm, còn `useEffect` đóng vai trò như "phản xạ" tự động kích hoạt gọi API hoặc thao tác ngầm ngay khi giao diện vừa hiện ra.

Câu 19: "Context API (hoặc Redux): Chia sẻ dữ liệu global giữa các component."
Dấu hiệu 1:
```jsx
import { useDispatch } from 'react-redux';
const dispatch = useDispatch();
dispatch(loginSuccess(data));
```
Dấu hiệu 2:
Dự án dùng Redux làm global state thay cho Context API. Nó đóng vai trò như một "đám mây" dữ liệu bay lơ lửng trên cùng, mọi Component ở mọi nơi đều có thể đưa tay lên lấy/sửa dữ liệu mà không cần truyền Props lằng nhằng.

### Mức Nâng cao (10 điểm)

Câu 20: "Advanced Routing: Quản lý route phức tạp."
Dấu hiệu 1:
```jsx
// App.jsx
<Routes>
    <Route path="/login" element={<Login />} />
</Routes>
```
Dấu hiệu 2:
Sử dụng thư viện `react-router-dom`. Nó đóng vai trò tạo ra hệ thống bản đồ Ảo, giúp khi ấn link chuyển trang thì màn hình mượt mà thay đổi ruột mà không cần xoay vòng vòng load lại nguyên trang (SPA).

Câu 21: "State Persistence: Lưu trữ khôi phục trạng thái."
Dấu hiệu 1:
```javascript
// store/slices/authSlice.js hoặc code gọi API
localStorage.setItem('token', token);
```
Dấu hiệu 2:
Dùng hàm `localStorage` của trình duyệt. Đóng vai trò cất giữ token vĩnh viễn vào ổ cứng, giúp người dùng lỡ bấm F5 hay tắt máy tính bật lại thì web vẫn nhớ họ là ai (Persistence).

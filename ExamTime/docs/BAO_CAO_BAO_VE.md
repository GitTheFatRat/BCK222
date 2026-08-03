# 📋 BÁO CÁO GIẢI TRÌNH KỸ THUẬT & PHAO CỨU SINH — DỰ ÁN EXAMTIME

> **Dự án:** ExamTime — Hệ thống Luyện & Thi thử IELTS trực tuyến  
> **Công nghệ:** Node.js / Express (Backend) + ReactJS / Redux Toolkit (Frontend) + MongoDB Atlas (Database)  
> **Ngày tạo báo cáo:** 02/08/2026

---

# PHẦN A: BÁO CÁO GIẢI TRÌNH KỸ THUẬT DỰ ÁN WEB

> 📖 **Ghi chú cho Giám khảo:** Báo cáo này giải thích toàn bộ kỹ thuật của dự án bằng ngôn ngữ đời thường. Mỗi tiêu chí đều có **minh chứng bằng code** kèm **lời dịch nôm na**.

---

## 1. BACKEND (Node.js / Express)

### 🟢 Mức Cơ bản (4 điểm)

---

#### 1.1 Hiểu biết cơ bản về Node.js và npm

**Giải thích nôm na:** npm giống như một "siêu thị phần mềm" — thay vì tự viết mọi thứ từ đầu, ta vào siêu thị mua các "gói" (package) có sẵn do cộng đồng viết. File `package.json` giống như "danh sách đi chợ", liệt kê mọi gói cần dùng.

📂 **File:** [`backend/package.json`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/package.json)

```json
{
    "dependencies": {
        "bcryptjs": "^2.4.3",
        "cors": "^2.8.5",
        "dotenv": "^16.4.5",
        "express": "^5.0.1",
        "jsonwebtoken": "^9.0.2",
        "mongoose": "^9.0.0",
        "multer": "^2.2.0"
    }
}
```

> 🗣️ **Dịch nôm na:** Đây là "danh sách đi chợ" của dự án. Mỗi dòng là một gói công cụ: `express` để xây server, `mongoose` để nói chuyện với database MongoDB, `bcryptjs` để mã hoá mật khẩu, `jsonwebtoken` để tạo "thẻ ra vào" cho user, `multer` để nhận file upload (ghi âm speaking), `cors` để cho phép frontend nói chuyện với backend, `dotenv` để đọc thông tin bí mật (mật khẩu DB, secret key).

---

#### 1.2 Cài đặt và cấu hình Express.js cơ bản

**Giải thích nôm na:** Express giống như "bộ khung" để xây một nhà hàng. Nó giúp ta tiếp nhận "đơn gọi món" (request) từ khách (frontend) và trả lại "món ăn" (response — dữ liệu).

📂 **File:** [`backend/server.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/server.js)

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`[ExamTime Backend] Dang chay tai http://localhost:${PORT}`);
    });
});
```

> 🗣️ **Dịch nôm na:** Dòng `const app = express()` giống như "mở cửa nhà hàng". `app.use(cors())` cho phép khách từ địa chỉ khác (frontend chạy port 5173) vào ăn. `app.use(express.json())` cho phép nhà hàng hiểu "thực đơn" dạng JSON. `dotenv.config()` đọc "ghi chú bí mật" (mật khẩu DB) từ file `.env`. Cuối cùng `app.listen(PORT)` là "nhà hàng chính thức mở cửa đón khách ở cổng 5000".

---

#### 1.3 Xử lý các tuyến đường cơ bản (Routing) — GET & POST

**Giải thích nôm na:** Routing giống như "biển chỉ đường" trong nhà hàng — Đường này dẫn tới quầy đăng ký, đường kia dẫn tới khu vực thi. Mỗi "con đường" (route) xử lý một loại yêu cầu (GET = "cho tôi xem", POST = "tôi muốn gửi cái gì đó").

📂 **File:** [`backend/routes/authRoutes.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/routes/authRoutes.js)

```javascript
import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);    // POST: Đăng ký tài khoản mới
router.post('/login', login);          // POST: Đăng nhập
router.get('/me', authMiddleware, getMe); // GET: Lấy thông tin người dùng hiện tại

export default router;
```

> 🗣️ **Dịch nôm na:** Khi khách gửi đơn đăng ký (`POST /register`), hệ thống chuyển tới quầy `register` xử lý. Khi khách muốn đăng nhập (`POST /login`), chuyển tới quầy `login`. Khi khách đã đăng nhập muốn xem thông tin cá nhân (`GET /me`), phải qua "bảo vệ" (`authMiddleware`) kiểm tra thẻ trước rồi mới vào được quầy `getMe`.

📂 **File:** [`backend/server.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/server.js#L23-L26) — Đăng ký các nhóm route:

```javascript
app.use('/api/auth', authRoutes);     // Nhóm đường: xác thực
app.use('/api/exams', examRoutes);    // Nhóm đường: đề thi
app.use('/api/admin', adminRoutes);   // Nhóm đường: quản trị
app.use('/api/results', resultRoutes); // Nhóm đường: kết quả thi
```

> 🗣️ **Dịch nôm na:** Đây là "sơ đồ tầng" của nhà hàng. Tầng `/api/auth` chuyên phục vụ việc đăng ký/đăng nhập. Tầng `/api/exams` phục vụ xem và lấy đề thi. Tầng `/api/admin` dành riêng cho quản lý. Tầng `/api/results` xử lý nộp bài và xem kết quả.

---

#### 1.4 Hiểu biết cơ bản về Middleware

**Giải thích nôm na:** Middleware giống như "bảo vệ đứng ở cửa". Trước khi khách (request) vào được nhà hàng (controller), phải qua bảo vệ kiểm tra. Nếu không hợp lệ, bảo vệ chặn lại ngay, không cho vào. **Điểm khác biệt với Controller:** middleware là "người gác cổng" (kiểm tra, lọc, chặn), còn controller là "đầu bếp" (xử lý logic chính, nấu món, trả kết quả).

📂 **File:** [`backend/middlewares/authMiddleware.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/middlewares/authMiddleware.js)

```javascript
import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();  // Cho phép đi tiếp vào controller
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' })
    }
}
```

> 🗣️ **Dịch nôm na:** Bảo vệ kiểm tra "thẻ ra vào" (JWT token) trong túi áo khách (header). Nếu không có thẻ hoặc thẻ giả → đuổi ra. Nếu thẻ hợp lệ → ghi nhận danh tính khách vào `req.user` rồi gọi `next()` (vẫy tay cho đi tiếp vào gặp đầu bếp/controller). Đây chính là sự khác biệt: middleware kiểm tra rồi gọi `next()`, controller thì xử lý logic và trả `res.json()`.

---

#### 1.5 Thiết kế cơ sở dữ liệu cơ bản

**Giải thích nôm na:** Cơ sở dữ liệu giống như "nhà kho" của nhà hàng — lưu trữ mọi thứ: thông tin khách hàng, đề thi, kết quả thi. Dự án dùng MongoDB (NoSQL — "nhà kho linh hoạt") thông qua Mongoose (ODM — "thủ kho thông minh" giúp quản lý hàng hóa có trật tự).

**Mô hình quan hệ giữa các bảng (collections):**

| Quan hệ | Mô tả |
|---------|-------|
| **User → ExamResult** (1-n) | Một user có thể có nhiều kết quả thi |
| **Exam → ExamResult** (1-n) | Một đề thi có nhiều lượt thi |
| **Exam → ListeningSet** (1-1) | Mỗi đề thi gắn với 1 bộ Listening |
| **Exam → ReadingSet** (1-1) | Mỗi đề thi gắn với 1 bộ Reading |
| **Exam → WritingSet** (1-1) | Mỗi đề thi gắn với 1 bộ Writing |
| **Exam → SpeakingSet** (1-1) | Mỗi đề thi gắn với 1 bộ Speaking |

📂 **File:** [`backend/models/Exam.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/models/Exam.js)

```javascript
const examSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    listeningSet: { type: mongoose.Schema.Types.ObjectId, ref: 'ListeningSet', required: true },
    readingSet: { type: mongoose.Schema.Types.ObjectId, ref: 'ReadingSet', required: true },
    writingSet: { type: mongoose.Schema.Types.ObjectId, ref: 'WritingSet', required: true },
    speakingSet: { type: mongoose.Schema.Types.ObjectId, ref: 'SpeakingSet', required: true },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });
```

> 🗣️ **Dịch nôm na:** Đây là "bản thiết kế" cho ngăn kéo "Đề Thi" trong nhà kho. Mỗi đề thi có: tên (`title`), mã code (`code` — duy nhất, viết hoa), và 4 "chìa khoá" (`ObjectId`) trỏ tới 4 ngăn kéo khác: Listening, Reading, Writing, Speaking. `ref: 'ListeningSet'` nghĩa là "chìa khoá này mở ngăn ListeningSet". Đây chính là **quan hệ 1-1** (mỗi đề thi gắn với đúng 1 bộ listening).

📂 **File:** [`backend/models/ExamResult.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/models/ExamResult.js)

```javascript
const examResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    skill: { type: String, enum: ['listening', 'reading', 'writing-task1', 'writing-task2', 'speaking', 'full'], required: true },
    sessionId: { type: String, required: true, index: true },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    scores: {
        listeningBand: { type: Number, default: null },
        readingBand: { type: Number, default: null },
        writingBand: { type: Number, default: null },
        speakingBand: { type: Number, default: null },
        overallBand: { type: Number, default: null },
    },
    cheatingLog: [{ timestamp: { type: Date, required: true }, type: { type: String, required: true }, _id: false }],
    status: { type: String, enum: ['SUBMITTED', 'GRADING', 'GRADED'], default: 'SUBMITTED' },
}, { timestamps: true });
```

> 🗣️ **Dịch nôm na:** Đây là "phiếu kết quả thi". Mỗi phiếu ghi: ai thi (`user` → trỏ tới bảng User = **quan hệ 1-n**: 1 user nhiều kết quả), thi đề nào (`exam` → trỏ tới bảng Exam), thi kỹ năng gì (`skill`), bài làm (`answers`), điểm (`scores`), và danh sách gian lận (`cheatingLog`). Trạng thái phiếu (`status`) cho biết: đã nộp, đang chấm, hay đã chấm xong.

---

#### 1.6 Truy vấn cơ bản (CRUD)

**Giải thích nôm na:** CRUD = Create (tạo mới), Read (đọc/xem), Update (sửa), Delete (xoá). Đây là 4 thao tác cơ bản nhất với dữ liệu, giống như nhà kho: nhập hàng, kiểm kho, sửa nhãn hàng, xuất/huỷ hàng.

📂 **File:** [`backend/controllers/authController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/authController.js) — **Create** (Đăng ký user mới):

```javascript
const newUser = new User({ username, email, password_hash });
await newUser.save();
res.status(201).json({ message: 'User registered successfully' });
```

> 🗣️ **Dịch nôm na:** Tạo một "hồ sơ khách hàng mới" rồi bỏ vào ngăn kéo User trong nhà kho. `.save()` nghĩa là "lưu vào kho".

📂 **File:** [`backend/controllers/examController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/examController.js) — **Read** (Đọc danh sách đề thi):

```javascript
const exams = await Exam.find({ isPublished: true }).select('title code createdAt');
return res.json(exams);
```

> 🗣️ **Dịch nôm na:** Vào nhà kho tìm tất cả đề thi đã công khai (`isPublished: true`), chỉ lấy ra tên, mã code và ngày tạo (`.select()` giống như "chỉ lấy cột A, B, C"). Trả về danh sách cho khách.

📂 **File:** [`backend/controllers/resultController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/resultController.js#L269-L304) — **Update** (Admin chấm điểm):

```javascript
export async function gradeResult(req, res) {
    const { id } = req.params;
    const { score } = req.body;

    const result = await ExamResult.findById(id);
    if (result.skill.startsWith('writing')) {
        result.scores.writingBand = Number(score);
    } else if (result.skill === 'speaking') {
        result.scores.speakingBand = Number(score);
    }
    result.status = 'GRADED';
    result.scores.overallBand = calculateOverallBand(result.scores);
    result.markModified('scores');
    await result.save();
}
```

> 🗣️ **Dịch nôm na:** Admin tìm "phiếu kết quả" theo mã ID, cập nhật điểm writing/speaking mà giáo viên chấm tay, tính lại điểm tổng, rồi lưu lại vào kho. Đây là thao tác **Update**.

---

### 🟡 Mức Trung bình (7 điểm)

---

#### 1.7 Xử lý tuyến đường nâng cao — PUT, DELETE, Params

📂 **File:** [`backend/routes/resultRoutes.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/routes/resultRoutes.js)

```javascript
router.post('/submit', authMiddleware, upload.single('speakingRecording'), submitResult);
router.get('/me', authMiddleware, getMyResults);
router.get('/admin/pending', authMiddleware, adminMiddleware, getPendingGradingTasks);
router.put('/admin/:id/grade', authMiddleware, adminMiddleware, gradeResult);
```

> 🗣️ **Dịch nôm na:** `PUT /admin/:id/grade` — Dùng phương thức PUT (cập nhật) để chấm điểm, trong đó `:id` là **tham số trên đường dẫn** (giống số bàn trong nhà hàng). Server lấy ra giá trị `id` bằng `req.params.id` để biết đang chấm "phiếu bài" nào. Dự án sử dụng đủ GET, POST, PUT.

📂 **File:** [`backend/routes/examRoutes.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/routes/examRoutes.js) — Lấy tham số `:code`:

```javascript
router.get('/:code', filterExamMiddleware, getExamByCode);
```

> 🗣️ **Dịch nôm na:** Khách gọi `GET /api/exams/CAMBRIDGE-19-TEST01` → server lấy `code = "CAMBRIDGE-19-TEST01"` từ URL rồi tìm đề thi tương ứng trong kho.

---

#### 1.8 Sử dụng Middleware phức tạp — Validation, Auth, File Upload, Data Filtering

Dự án có **4 middleware** chuyên biệt:

**a) Auth Middleware** (đã trình bày ở mục 1.4)

**b) Admin Middleware** — Kiểm tra quyền admin:

📂 **File:** [`backend/middlewares/adminMiddleware.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/middlewares/adminMiddleware.js)

```javascript
export function adminMiddleware(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
}
```

> 🗣️ **Dịch nôm na:** Sau khi bảo vệ auth kiểm tra thẻ xong, tới "cửa VIP" (adminMiddleware) kiểm tra thêm: nếu trên thẻ ghi role = 'admin' mới cho vào, không thì trả "403 Cấm".

**c) Role Middleware** — Kiểm tra nhiều vai trò linh hoạt:

📂 **File:** [`backend/middlewares/roleMiddleware.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/middlewares/roleMiddleware.js)

```javascript
export function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' })
        }
        next();
    }
}
```

> 🗣️ **Dịch nôm na:** Đây là "bảo vệ VIP nâng cao" — có thể cho nhiều loại vai trò vào. Ví dụ `roleMiddleware('admin')` chỉ cho admin, nhưng có thể mở rộng thành `roleMiddleware('admin', 'teacher')` cho cả giáo viên.

**d) Filter Exam Middleware** — Lọc đáp án khi thi thật:

📂 **File:** [`backend/middlewares/filterExamMiddleware.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/middlewares/filterExamMiddleware.js)

```javascript
const FIELDS_TO_STRIP = ['correctAnswer', 'explanation'];

function stripAnswerFields(data) {
    if (Array.isArray(data)) return data.map(stripAnswerFields);
    if (data !== null && typeof data === 'object') {
        const clone = { ...data };
        for (const field of FIELDS_TO_STRIP) delete clone[field];
        for (const key of Object.keys(clone)) clone[key] = stripAnswerFields(clone[key]);
        return clone;
    }
    return data;
}

export function filterExamMiddleware(req, res, next) {
    const originalJson = res.json.bind(res);
    res.json = (payload) => {
        if (req.query.mode === 'exam') {
            const plainPayload = JSON.parse(JSON.stringify(payload));
            return originalJson(stripAnswerFields(plainPayload));
        }
        return originalJson(payload);
    };
    next();
}
```

> 🗣️ **Dịch nôm na:** Khi thí sinh vào "chế độ thi thật" (`mode=exam`), middleware này giống "nhân viên kiểm duyệt" — nó chặn đáp án đúng (`correctAnswer`) và giải thích (`explanation`) trước khi gửi đề thi cho thí sinh, để thí sinh không thấy đáp án. Khi ở chế độ luyện tập thì giữ nguyên.

**e) Multer — Upload file ghi âm speaking:**

📂 **File:** [`backend/routes/resultRoutes.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/routes/resultRoutes.js#L10-L22)

```javascript
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/speaking/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, `${req.user.id}-${uniqueSuffix}.webm`);
    },
});
const upload = multer({ storage });

router.post('/submit', authMiddleware, upload.single('speakingRecording'), submitResult);
```

> 🗣️ **Dịch nôm na:** Multer giống "nhân viên nhận hàng" chuyên xử lý file upload. Khi thí sinh gửi bài ghi âm speaking, Multer nhận file, đặt tên theo `userID-timestamp.webm` rồi lưu vào thư mục `uploads/speaking/`. `upload.single('speakingRecording')` nghĩa là "chỉ nhận 1 file duy nhất có tên trường là speakingRecording".

---

#### 1.9 Kết nối cơ sở dữ liệu — MongoDB Atlas

📂 **File:** [`backend/config/db.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/config/db.js)

```javascript
import mongoose from "mongoose";
export async function connectDB() {
    const maxRetry = 3;
    let attempt = 0;

    while (attempt < maxRetry) {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log("Connected to DB");
            return;
        } catch (err) {
            attempt += 1;
            if (attempt >= maxRetry) {
                console.error('[DB] Max retry reached. Exit')
                process.exit(1)
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 * Math.min(attempt, 5)));
        }
    }
}
```

> 🗣️ **Dịch nôm na:** Hệ thống kết nối tới "nhà kho trên mây" (MongoDB Atlas). Nếu kết nối thất bại (ví dụ mạng chập chờn), nó **thử lại tối đa 3 lần**, mỗi lần chờ lâu hơn lần trước (1s, 2s, 3s — gọi là **Exponential Backoff**). Nếu hết 3 lần vẫn thất bại → tắt server, không chạy "nhà hàng không có kho".

---

#### 1.10 Quản lý lỗi — Error Handling

📂 **File:** [`backend/server.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/server.js#L32-L35) — Global Error Handler:

```javascript
app.use((err, req, res, next) => {
    console.error('[Global Error Handler]', err);
    res.status(err.status || 500).json({ message: err.message || 'Loi server noi bo.' });
});
```

> 🗣️ **Dịch nôm na:** Đây là "lưới an toàn cuối cùng". Nếu bất kỳ chỗ nào trong nhà hàng xảy ra sự cố mà không ai xử lý, lưới này bắt lại, ghi log lỗi, và trả cho khách thông báo lịch sự thay vì crash cả server.

📂 **File:** [`backend/controllers/authController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/authController.js#L14-L45) — Validation + Error trả client:

```javascript
export async function register(req, res) {
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        // ...xử lý chính...
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
```

> 🗣️ **Dịch nôm na:** Mỗi controller đều "bọc" trong try-catch. Trước khi xử lý, kiểm tra dữ liệu đầu vào: thiếu field → trả 400, mật khẩu quá ngắn → trả 400, trùng username/email → trả 400. Nếu xảy ra lỗi bất ngờ → trả 500 với thông báo chung, không lộ chi tiết kỹ thuật cho hacker.

---

### 🔴 Mức Nâng cao (10 điểm)

---

#### 1.11 Tối ưu hóa hiệu năng

📂 **File:** [`backend/controllers/ingestController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/ingestController.js#L94-L99) — Ghi song song:

```javascript
const [listeningResult, readingResult, writingResult, speakingResult] = await Promise.all([
    ListeningSet.bulkWrite([{ insertOne: { document: listeningData } }]),
    ReadingSet.bulkWrite([{ insertOne: { document: readingData } }]),
    WritingSet.bulkWrite([{ insertOne: { document: writingData } }]),
    SpeakingSet.bulkWrite([{ insertOne: { document: speakingData } }]),
]);
```

> 🗣️ **Dịch nôm na:** Thay vì lưu từng kỹ năng vào kho một cách tuần tự (chờ xong cái 1 mới làm cái 2), dùng `Promise.all` để lưu **cả 4 cùng lúc** — giống như 4 nhân viên nhập kho đồng thời thay vì 1 người làm 4 việc. Nhanh hơn gần 4 lần.

📂 **File:** [`backend/controllers/resultController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/resultController.js#L10-L16) — Cache bảng band:

```javascript
let bandScale = null;
async function loadBandScale() {
    if (!bandScale) {
        const raw = await readFile(new URL('../config/bandScale.json', import.meta.url), 'utf-8');
        bandScale = JSON.parse(raw);
    }
    return bandScale;
}
```

> 🗣️ **Dịch nôm na:** Bảng quy đổi điểm IELTS (bao nhiêu câu đúng = band mấy) chỉ đọc file **1 lần duy nhất**, sau đó giữ trong bộ nhớ (`bandScale`). Lần sau ai hỏi thì trả ngay, không cần đọc file lại. Đây là kỹ thuật **caching**.

📂 **File:** [`backend/models/ExamResult.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/models/ExamResult.js#L23) — Index tối ưu truy vấn:

```javascript
sessionId: { type: String, required: true, index: true },
```

> 🗣️ **Dịch nôm na:** `index: true` giống "dán nhãn mã vạch" lên sessionId — giúp MongoDB tìm kiếm theo sessionId nhanh hơn rất nhiều so với duyệt từng phiếu một.

---

#### 1.12 Bảo mật ứng dụng — JWT

📂 **File:** [`backend/controllers/authController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/authController.js#L1-L12) — Tạo JWT Token + Mã hoá mật khẩu:

```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

function signToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
    });
}

// Khi đăng ký:
const salt = await bcrypt.genSalt(SALT_ROUNDS);
const password_hash = await bcrypt.hash(password, salt);
```

> 🗣️ **Dịch nôm na:** 
> - **Mã hoá mật khẩu (bcrypt):** Mật khẩu được "xay nhuyễn" bằng bcrypt với 10 vòng salt — giống như khoá két sắt 10 lớp, ngay cả admin cũng không thể đọc ngược mật khẩu gốc.
> - **JWT Token:** Sau đăng nhập, server cấp "thẻ ra vào" (token) chứa ID và vai trò user, có **hạn sử dụng 7 ngày**. Thẻ này được ký bằng chìa khoá bí mật (`JWT_SECRET`). Ai giả mạo thẻ sẽ bị phát hiện ngay.

---

#### 1.13 Kiến trúc MVC + RESTful API

Dự án áp dụng rõ ràng kiến trúc **MVC (Model–View–Controller)**:

| Thành phần | Thư mục | Vai trò |
|-----------|---------|---------|
| **Model** | `backend/models/` | "Bản vẽ nhà kho" — định nghĩa cấu trúc dữ liệu |
| **View** | `frontend/` (React) | "Mặt tiền nhà hàng" — giao diện người dùng |
| **Controller** | `backend/controllers/` | "Đầu bếp" — xử lý logic nghiệp vụ |
| Routes | `backend/routes/` | "Biển chỉ đường" — điều phối request |
| Middleware | `backend/middlewares/` | "Bảo vệ" — kiểm tra trước khi vào controller |

**RESTful API** — Dự án tuân thủ nguyên tắc REST:

| Method | URL | Ý nghĩa |
|--------|-----|---------|
| `GET` | `/api/exams` | Lấy danh sách đề thi |
| `GET` | `/api/exams/:code` | Lấy chi tiết 1 đề thi |
| `POST` | `/api/auth/register` | Tạo tài khoản mới |
| `POST` | `/api/results/submit` | Nộp bài thi |
| `PUT` | `/api/results/admin/:id/grade` | Cập nhật điểm |
| `GET` | `/api/results/me` | Xem lịch sử kết quả |

---

#### 1.14 Mô tả API

Dự án có các file tài liệu nội bộ trong thư mục `docs/`:

📂 **Thư mục:** [`docs/`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/docs)

| File | Nội dung |
|------|----------|
| `01_ARCHITECTURE_OVERVIEW.md` | Tổng quan kiến trúc hệ thống |
| `02_DATABASE_SCHEMA.md` | Thiết kế cơ sở dữ liệu |
| `03_BACKEND_WALKTHROUGH.md` | Hướng dẫn chi tiết backend |
| `04_FRONTEND_WALKTHROUGH.md` | Hướng dẫn chi tiết frontend |
| `05_END_TO_END_FLOWS.md` | Luồng hoạt động đầu-cuối |
| `06_GLOSSARY.md` | Bảng thuật ngữ |

---

## 2. FRONTEND (ReactJS)

### 🟢 Mức Cơ bản (4 điểm)

---

#### 2.1 Cài đặt dự án React

Dự án sử dụng **Vite** (công cụ build hiện đại, nhanh hơn CRA) với React 19.

📂 **File:** [`frontend/package.json`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/package.json)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.28.0",
    "@reduxjs/toolkit": "^2.3.0",
    "react-redux": "^9.1.2",
    "axios": "^1.7.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3",
    "vite": "^6.0.0"
  }
}
```

> 🗣️ **Dịch nôm na:** Danh sách "nguyên liệu" của giao diện: React để xây giao diện, React Router để điều hướng trang, Redux Toolkit để quản lý "trí nhớ" chung của app, Axios để gửi/nhận dữ liệu với server, Vite để đóng gói và chạy nhanh.

📂 **File:** [`frontend/src/main.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/main.jsx) — Điểm khởi đầu ứng dụng:

```jsx
createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
)
```

> 🗣️ **Dịch nôm na:** Đây là "nơi bắt đầu của mọi thứ". `<Provider>` giống "hệ thống loa phát thanh toàn toà nhà" — mọi tầng (component) đều nghe được thông tin từ Redux store. `<BrowserRouter>` giống "thang máy" — giúp di chuyển giữa các trang mà không cần tải lại.

---

#### 2.2 Cấu trúc Component và JSX

📂 **File:** [`frontend/src/features/dashboard/ExamCard.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/features/dashboard/ExamCard.jsx)

```jsx
export default function ExamCard({ exam }) {
    return (
        <div className="exam-card">
            <div className="exam-card-header">
                <h3>{exam.title}</h3>
                <span className={exam.isCompleted ? 'badge badge-done' : 'badge badge-pending'}>
                    {exam.isCompleted ? `Completed - Band ${exam.bestBand ?? '--'}` : 'Not Yet'}
                </span>
            </div>
            <div className="exam-card-footer">
                <Link to={`/exam/${exam.examId}/listening`} className="btn btn-primary">
                    Take Exam
                </Link>
            </div>
        </div>
    );
}
```

> 🗣️ **Dịch nôm na:** Đây là một "thẻ đề thi" — mỗi lần gọi `<ExamCard exam={...} />` sẽ hiện ra 1 thẻ. JSX giống HTML nhưng viết bên trong JavaScript — cho phép xen kẽ logic (if/else, biến) vào giao diện. Ví dụ `{exam.isCompleted ? 'Completed' : 'Not Yet'}` nghĩa là "nếu đã thi xong thì hiện 'Completed', ngược lại hiện 'Not Yet'".

---

#### 2.3 Components và Props

**Giải thích nôm na:** Component giống "viên gạch LEGO" — xây ghép lại thành ứng dụng hoàn chỉnh. Props giống "thông số đặt hàng" — component cha truyền dữ liệu xuống component con qua props.

📂 **File:** [`frontend/src/pages/PracticeRoom.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/PracticeRoom.jsx#L86-L101) — Cha truyền props xuống con:

```jsx
{skill === 'writing-task1' && examData.writingSet && (
    <WritingEditor
        task="Task1"
        minWords={examData.writingSet.task1.minWords}
        prompt={examData.writingSet.task1.prompt}
        imageUrl={examData.writingSet.task1.imageUrl}
    />
)}
```

> 🗣️ **Dịch nôm na:** Component cha (`PracticeRoom`) truyền "đơn hàng" xuống component con (`WritingEditor`): "Đây là Task 1, tối thiểu 150 từ, đề bài là cái này, ảnh biểu đồ là cái kia". Con nhận qua `props` rồi hiển thị tương ứng.

Dự án sử dụng **100% Functional Components** (không dùng class component).

---

#### 2.4 Xử lý sự kiện — onClick, onChange, onSubmit

📂 **File:** [`frontend/src/pages/Login.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/Login.jsx)

```jsx
function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
}

async function handleSubmit(e) {
    e.preventDefault()
    // ...gọi API login...
}

return (
    <form onSubmit={handleSubmit}>
        <input name="email" value={form.email} onChange={handleChange} />
        <input name="password" value={form.password} onChange={handleChange} />
        <button type="submit">Login</button>
    </form>
);
```

> 🗣️ **Dịch nôm na:** Ba sự kiện chính:
> - **onChange:** Mỗi lần người dùng gõ phím trong ô input, `handleChange` cập nhật giá trị vào state.
> - **onSubmit:** Khi bấm nút Login, `handleSubmit` gửi email/password lên server.
> - **e.preventDefault():** Ngăn form tự reload trang (hành vi mặc định của HTML form).

---

#### 2.5 Rendering Lists và Keys

📂 **File:** [`frontend/src/pages/HomeDashboard.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/HomeDashboard.jsx#L58-L62)

```jsx
<div className="exams-grid">
    {exams.map((exam) => (
        <ExamCard key={exam.examId} exam={exam} />
    ))}
</div>
```

> 🗣️ **Dịch nôm na:** `.map()` giống "dây chuyền sản xuất" — lặp qua danh sách đề thi, mỗi đề tạo ra 1 thẻ ExamCard. **Key** (`key={exam.examId}`) giống "số serial" — giúp React biết thẻ nào đã thay đổi, thẻ nào còn nguyên, để chỉ cập nhật đúng thẻ cần thiết thay vì vẽ lại toàn bộ (tối ưu hiệu năng).

---

#### 2.6 Form và Controlled Components

📂 **File:** [`frontend/src/pages/Register.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/Register.jsx)

```jsx
const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }))
}

// Trong JSX:
<input name="username" value={form.username} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />
<input name="password" value={form.password} onChange={handleChange} />
```

> 🗣️ **Dịch nôm na:** Đây là **Controlled Component** — giá trị ô input (`value`) luôn "bị React kiểm soát" thông qua state (`form`). Khi gõ, `onChange` cập nhật state → state thay đổi → React vẽ lại input với giá trị mới. React luôn là "ông chủ" của dữ liệu form, không để input "tự do" như HTML thuần.

---

### 🟡 Mức Trung bình (7 điểm)

---

#### 2.7 Hooks — useState, useEffect

📂 **File:** [`frontend/src/pages/HomeDashboard.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/HomeDashboard.jsx)

```jsx
const [exams, setExams] = useState([]);
const [results, setResults] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
    async function loadDashboardData() {
        setIsLoading(true);
        try {
            const [examList, history] = await Promise.all([getExam(), getMyResultHistory()]);
            setExams(formattedExams);
            setResults(history);
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setIsLoading(false);
        }
    }
    loadDashboardData();
}, []);
```

> 🗣️ **Dịch nôm na:** 
> - **useState:** Giống "bảng ghi nhớ" của component. `useState([])` tạo bảng rỗng, `setExams(...)` ghi dữ liệu mới lên bảng → React tự vẽ lại giao diện.
> - **useEffect:** Giống "lời nhắc nhở" — "Khi component vừa xuất hiện trên màn hình lần đầu (`[]`), hãy gọi API lấy dữ liệu". `[]` rỗng = chỉ chạy 1 lần khi component mount.

---

#### 2.8 Redux Toolkit — Quản lý Global State (thay Context API)

**Giải thích nôm na:** Dự án dùng **Redux Toolkit** (công nghệ mạnh hơn Context API) để quản lý "trí nhớ chung" của cả ứng dụng. Giống như "đài phát thanh trung tâm" — mọi component ở bất kỳ tầng nào đều nghe được tin tức (state) mà không cần truyền qua props từng tầng.

📂 **File:** [`frontend/src/store/slices/authSlice.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/store/slices/authSlice.js)

```javascript
const authSlice = createSlice({
    name: 'auth',
    initialState: loadInitialState,
    reducers: {
        loginSuccess(state, action) {
            const { token, user } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }
});
```

> 🗣️ **Dịch nôm na:** Redux store có 3 "kênh" (slice): `auth` (thông tin đăng nhập), `examSession` (phiên thi đang diễn ra), `answers` (câu trả lời). Khi login thành công, `loginSuccess` cập nhật trạng thái → mọi component (sidebar, navbar, trang chủ) đều biết ngay "user đã đăng nhập" mà không cần truyền props lòng vòng.

📂 **File:** [`frontend/src/store/index.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/store/index.js) — Cấu hình store:

```javascript
export const store = configureStore({
    reducer: {
        auth: authReducer,
        examSession: examSessionReducer,
        answers: answerReducer,
    },
    devTools: import.meta.env.MODE !== 'production',
});
```

> 🗣️ **Dịch nôm na:** "Tổng đài" Redux có 3 "phòng ban": `auth` lo việc đăng nhập, `examSession` lo phiên thi (countdown, gian lận), `answers` lo lưu câu trả lời. `devTools` bật công cụ debug trong môi trường phát triển.

---

#### 2.9 Tối ưu render — useMemo

📂 **File:** [`frontend/src/features/writing/WritingEditor.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/features/writing/WritingEditor.jsx)

```jsx
const wordCount = useMemo(() => {
    return content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length;
}, [content]);

const isBelowMin = useMemo(() => wordCount < minWords, [wordCount, minWords]);
```

> 🗣️ **Dịch nôm na:** `useMemo` giống "bảng tính có cache" — chỉ tính lại số từ (`wordCount`) khi nội dung bài viết (`content`) thay đổi. Nếu component bị vẽ lại vì lý do khác (ví dụ countdown timer tick), nó không tính lại vô ích, tiết kiệm tài nguyên.

---

#### 2.10 useCallback — Tối ưu hàm callback

📂 **File:** [`frontend/src/pages/ExamRoom.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/ExamRoom.jsx#L129-L196)

```jsx
const handleSubmit = useCallback(async () => {
    if (isSubmitting || hasSubmittedRef.current || !examData) return;
    // ...logic nộp bài...
}, [isSubmitting, examData, dispatch, skill, answers, cheatingLog, ...]);
```

> 🗣️ **Dịch nôm na:** `useCallback` giống "lưu bản sao hàm vào tủ" — hàm `handleSubmit` chỉ tạo mới khi các phụ thuộc thay đổi. Tránh việc mỗi lần component render lại tạo ra một hàm mới vô ích.

---

#### 2.11 Validation form thủ công (thay Formik/Yup)

📂 **File:** [`frontend/src/pages/Register.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/Register.jsx#L16-L27)

```jsx
function validate() {
    if (!form.username || !form.email || !form.password) {
        return 'Please fill in all fields.';
    }
    if (form.password.length < 6) {
        return 'Please enter at least 6 characters.';
    }
    if (form.password !== form.confirmPassword) {
        return 'Password is not match.';
    }
    return '';
}
```

> 🗣️ **Dịch nôm na:** Trước khi gửi đơn đăng ký lên server, kiểm tra tại chỗ: bỏ trống → báo lỗi, mật khẩu quá ngắn → báo lỗi, nhập lại mật khẩu không khớp → báo lỗi. Dự án tự viết validation thay vì dùng thư viện Formik/Yup.

> ⚠️ **Ghi nhận:** Dự án **chưa sử dụng** thư viện Formik/Yup mà tự viết validation logic. Đây là cách tiếp cận đơn giản, phù hợp với form không quá phức tạp.

---

#### 2.12 Error Handling trong Frontend

📂 **File:** [`frontend/src/pages/ExamRoom.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/ExamRoom.jsx#L84-L115) — Cleanup pattern:

```jsx
useEffect(() => {
    let isCancelled = false;
    async function loadExamData() {
        try {
            const data = await getExamByCode(examCode, 'exam');
            if (isCancelled) return;
            setExamData(data);
        } catch (err) {
            if (!isCancelled) {
                setLoadError(err.response?.data?.message || 'Failed to load exam.');
            }
        }
    }
    loadExamData();
    return () => { isCancelled = true; };
}, [examCode, skill]);
```

> 🗣️ **Dịch nôm na:** Biến `isCancelled` ngăn "tay ma" — nếu user rời trang trước khi API trả về (component bị huỷ), code vẫn cố gắng cập nhật state → gây lỗi. Dùng `isCancelled` để "nếu component đã chết rồi thì bỏ qua, không cập nhật nữa". Đây là **best practice** để xử lý lỗi race condition.

> ⚠️ **Error Boundaries:** Dự án **chưa triển khai** Error Boundaries (component bắt lỗi render). Hiện tại xử lý lỗi bằng try-catch trong useEffect và hiển thị thông báo lỗi thủ công.

---

### 🔴 Mức Nâng cao (10 điểm)

---

#### 2.13 Advanced Routing và Dynamic Routing

📂 **File:** [`frontend/src/App.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/App.jsx)

```jsx
<Routes>
    <Route path="/login" element={<LoginReturnHome><Login /></LoginReturnHome>} />
    <Route path="/register" element={<LoginReturnHome><Register /></LoginReturnHome>} />
    <Route path="/" element={<ForceAuth><HomeDashboard /></ForceAuth>} />
    <Route path="/practice/:examId/:skill" element={<ForceAuth><PracticeRoom /></ForceAuth>} />
    <Route path="/exam/:examId/:skill" element={
        <ForceAuth><RouteGuard><ExamRoom /></RouteGuard></ForceAuth>
    } />
    <Route path="/admin/grading" element={
        <ForceAuth><AdminRoute><AdminDashboard /></AdminRoute></ForceAuth>
    } />
    <Route path="/admin/cheating-logs" element={
        <ForceAuth><AdminRoute><AdminCheatingLogs /></AdminRoute></ForceAuth>
    } />
    <Route path="*" element={<NotFound />} />
</Routes>
```

> 🗣️ **Dịch nôm na:** 
> - **Dynamic Routing:** `/exam/:examId/:skill` — `:examId` và `:skill` là "biến" trên URL. Ví dụ `/exam/CAMBRIDGE-19-TEST01/listening` → examId = "CAMBRIDGE-19-TEST01", skill = "listening".
> - **Route Guards lồng nhau:** `<ForceAuth>` → kiểm tra đăng nhập → `<AdminRoute>` → kiểm tra admin → `<AdminDashboard>`. Giống 2 lớp cửa: cửa chung (đăng nhập) rồi cửa VIP (admin).
> - **Catch-all route:** `path="*"` bắt mọi URL không tồn tại → hiện trang 404.

---

#### 2.14 State Persistence — Lưu trữ/Khôi phục trạng thái

📂 **File:** [`frontend/src/store/slices/authSlice.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/store/slices/authSlice.js#L6-L21) — Auth persistence qua localStorage:

```javascript
function loadInitialState() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    let user = null;
    try {
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch { user = null; }
    return {
        user,
        token,
        isAuthenticated: Boolean(token && user),
    };
}
```

> 🗣️ **Dịch nôm na:** Khi user đăng nhập, token và thông tin user được lưu vào **localStorage** (giống "sổ tay bỏ túi" của trình duyệt). Khi tắt trình duyệt rồi mở lại, hàm `loadInitialState` đọc lại sổ tay → user vẫn đăng nhập, không cần đăng nhập lại. Đây là **State Persistence**.

📂 **File:** [`frontend/src/pages/ExamRoom.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/ExamRoom.jsx#L56-L81) — Session persistence:

```javascript
useEffect(() => {
    const key = `examtime_session_${examCode}`;
    let stored = localStorage.getItem(key);
    let validSessionId = null;

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            if (Date.now() - parsed.timestamp < thirtyDays) {
                validSessionId = parsed.sessionId;
            }
        } catch (e) { }
    }

    if (!validSessionId) {
        validSessionId = crypto.randomUUID();
        localStorage.setItem(key, JSON.stringify({ sessionId: validSessionId, timestamp: Date.now() }));
    }
    setSessionId(validSessionId);
}, [examCode]);
```

> 🗣️ **Dịch nôm na:** Mỗi lần vào phòng thi, hệ thống tạo "mã phiên thi" (`sessionId`) lưu vào localStorage. Nếu user tắt máy rồi mở lại trong 30 ngày → vẫn giữ nguyên mã phiên cũ (để gộp điểm các kỹ năng vào cùng 1 phiên). Sau 30 ngày → tạo phiên mới.

---

#### 2.15 Axios Interceptors — Xử lý token tự động

📂 **File:** [`frontend/src/config/axios.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/config/axios.js)

```javascript
apiClient.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

> 🗣️ **Dịch nôm na:** **Request Interceptor:** Mỗi lần gửi request, tự động "gắn thẻ ra vào" (token) vào header mà không cần viết lặp đi lặp lại ở mỗi nơi gọi API. **Response Interceptor:** Nếu server trả "401 Hết hạn thẻ" → tự động đăng xuất và chuyển về trang login. Giống "nhân viên hậu cần" âm thầm làm việc ở hậu trường.

---

#### 2.16 Class Component

> ⚠️ **Chưa triển khai.** Dự án sử dụng **100% Functional Components với Hooks** — đây là cách tiếp cận hiện đại và được React chính thức khuyến nghị kể từ React 16.8+.

---

## BẢNG TỔNG KẾT TIÊU CHÍ

### Backend

| # | Tiêu chí | Trạng thái | Mức |
|---|----------|-----------|-----|
| 1 | Node.js và npm | ✅ Đã triển khai | Cơ bản |
| 2 | Cài đặt Express.js | ✅ Đã triển khai | Cơ bản |
| 3 | Routing cơ bản (GET, POST) | ✅ Đã triển khai | Cơ bản |
| 4 | Middleware cơ bản | ✅ Đã triển khai (4 middleware) | Cơ bản |
| 5 | Thiết kế CSDL (quan hệ 1-1, 1-n) | ✅ Đã triển khai | Cơ bản |
| 6 | Truy vấn CRUD | ✅ Đã triển khai (Create, Read, Update) | Cơ bản |
| 7 | Routing nâng cao (PUT, params) | ✅ Đã triển khai | Trung bình |
| 8 | Middleware phức tạp (auth, role, filter, upload) | ✅ Đã triển khai | Trung bình |
| 9 | Kết nối MongoDB Atlas + CRUD thực tế | ✅ Đã triển khai (retry logic) | Trung bình |
| 10 | Quản lý lỗi | ✅ Đã triển khai (global + per-route) | Trung bình |
| 11 | Tối ưu hiệu năng (Promise.all, caching, index) | ✅ Đã triển khai | Nâng cao |
| 12 | Bảo mật (JWT + bcrypt) | ✅ Đã triển khai | Nâng cao |
| 13 | Kiến trúc MVC + RESTful API | ✅ Đã triển khai | Nâng cao |
| 14 | Tài liệu API | ✅ Đã triển khai (thư mục docs/) | Nâng cao |

### Frontend

| # | Tiêu chí | Trạng thái | Mức |
|---|----------|-----------|-----|
| 1 | Cài đặt React (Vite) | ✅ Đã triển khai | Cơ bản |
| 2 | Component và JSX | ✅ Đã triển khai | Cơ bản |
| 3 | Components và Props | ✅ Đã triển khai | Cơ bản |
| 4 | Xử lý sự kiện | ✅ Đã triển khai | Cơ bản |
| 5 | Rendering Lists và Keys | ✅ Đã triển khai | Cơ bản |
| 6 | Controlled Components | ✅ Đã triển khai | Cơ bản |
| 7 | Hooks (useState, useEffect) | ✅ Đã triển khai | Trung bình |
| 8 | Global State (Redux Toolkit thay Context API) | ✅ Đã triển khai (3 slices) | Trung bình |
| 9 | Optimization (useMemo, useCallback) | ✅ Đã triển khai | Trung bình |
| 10 | Form Validation (thủ công) | ✅ Đã triển khai | Trung bình |
| 11 | Formik/Yup | ❌ Chưa triển khai (dùng validation thủ công) | Trung bình |
| 12 | Error Boundaries | ❌ Chưa triển khai | Trung bình |
| 13 | Dynamic Routing + Route Guards | ✅ Đã triển khai | Nâng cao |
| 14 | State Persistence (localStorage) | ✅ Đã triển khai | Nâng cao |
| 15 | Class Component | ❌ Chưa triển khai (dùng 100% Functional) | Nâng cao |

---
---

# PHẦN B: "PHAO CỨU SINH" DÀNH RIÊNG CHO BẠN 🛟

> ⚠️ **Phần này chỉ dành cho bạn — KHÔNG nộp cho giám khảo!**

---

## 1. TOP 5 CÂU HỎI "CHÍ MẠNG" & CÂU TRẢ LỜI MẪU

---

### ❓ Câu 1: "Giải thích cách hệ thống chấm điểm tự động hoạt động? Tại sao có bài phải chấm tay, có bài tự chấm?"

**📍 Code liên quan:** [`backend/controllers/resultController.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/controllers/resultController.js) — hàm `submitResult`, `countCorrectAnswers`, `lookupBand`

**💬 Câu trả lời mẫu:**

> "Dạ, hệ thống chia làm 2 loại chấm điểm:
> 
> **Chấm tự động** cho Listening và Reading: Khi thí sinh nộp bài, server lấy bài làm của thí sinh so khớp với đáp án đúng trong database, đếm số câu đúng, rồi tra bảng quy đổi IELTS band (ví dụ 35-36 câu đúng Listening = band 8.0). Bảng quy đổi này em lưu trong file `bandScale.json`.
> 
> **Chấm tay** cho Writing và Speaking: Vì bài viết và bài nói không có đáp án cố định, nên hệ thống chỉ lưu bài và đánh dấu trạng thái là 'GRADING' (đang chờ chấm). Admin sẽ vào trang Grading để đọc bài viết / nghe ghi âm rồi nhập điểm thủ công."

---

### ❓ Câu 2: "Middleware `filterExamMiddleware` hoạt động như thế nào? Tại sao cần 'override' `res.json`?"

**📍 Code liên quan:** [`backend/middlewares/filterExamMiddleware.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/backend/middlewares/filterExamMiddleware.js)

**💬 Câu trả lời mẫu:**

> "Dạ, middleware này giải quyết bài toán: cùng 1 API `/api/exams/:code`, khi luyện tập thì hiện đáp án, khi thi thật thì phải ẩn đáp án.
> 
> Cách hoạt động: Middleware không sửa dữ liệu trước khi vào controller, mà 'đánh tráo' hàm `res.json` gốc. Khi controller gọi `res.json(data)`, thực ra đang gọi phiên bản 'đã chỉnh sửa'. Nếu URL có `?mode=exam`, phiên bản mới sẽ duyệt qua toàn bộ data, xoá hết `correctAnswer` và `explanation` trước khi trả về cho thí sinh. Nếu không có `mode=exam` thì trả nguyên. Kỹ thuật này gọi là 'monkey-patching response'."

---

### ❓ Câu 3: "Giải thích luồng nộp bài thi từ frontend đến backend? FormData là gì, tại sao dùng nó thay vì JSON?"

**📍 Code liên quan:** [`frontend/src/services/resultService.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/services/resultService.js) + [`frontend/src/pages/ExamRoom.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/ExamRoom.jsx#L129-L196)

**💬 Câu trả lời mẫu:**

> "Dạ, luồng nộp bài đi qua các bước:
> 
> 1. Khi bấm Submit (hoặc hết giờ tự động submit), frontend thu thập: câu trả lời từ Redux store (`answers`), bài viết Writing, file ghi âm Speaking (blob URL), và log gian lận.
> 2. Vì bài thi Speaking có **file ghi âm** (audio blob), mà JSON không gửi được file, nên phải dùng **FormData** — giống 'bưu kiện' có thể chứa cả văn bản lẫn file đính kèm. 
> 3. Backend dùng Multer để mở 'bưu kiện', tách file audio ra lưu vào thư mục `uploads/speaking/`, còn text thì xử lý bình thường.
> 4. Biến `hasSubmittedRef` ngăn nộp bài 2 lần (ví dụ hết giờ tự nộp đúng lúc user cũng bấm nộp)."

---

### ❓ Câu 4: "Redux Toolkit trong dự án này quản lý những gì? Tại sao không dùng Context API thôi?"

**📍 Code liên quan:** [`frontend/src/store/`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/store) — 3 slices: `authSlice`, `examSessionSlice`, `answerSlice`

**💬 Câu trả lời mẫu:**

> "Dạ, Redux quản lý 3 loại dữ liệu 'toàn cục':
> 
> - **authSlice:** Thông tin đăng nhập (token, user, isAuthenticated) — dùng ở sidebar, route guard, interceptor.
> - **examSessionSlice:** Trạng thái phiên thi (đang thi/đã nộp, thời gian còn lại, log gian lận) — dùng ở countdown timer, cheating detection, auto-submit.
> - **answerSlice:** Câu trả lời (listening/reading, bài viết writing, blob speaking) — dùng ở form listening, writing editor, speaking recorder, submit.
> 
> Em chọn Redux Toolkit thay vì Context API vì: Context API khi state thay đổi sẽ re-render tất cả component đang dùng context đó, trong khi Redux cho phép mỗi component chỉ subscribe phần state nó cần (qua `useSelector`), tránh render thừa. Với dữ liệu phức tạp như câu trả lời 40 câu thay đổi liên tục, Redux hiệu quả hơn."

---

### ❓ Câu 5: "Hệ thống phát hiện gian lận (`cheatingLog`) hoạt động thế nào? Đoạn `visibilitychange` làm gì?"

**📍 Code liên quan:** [`frontend/src/pages/ExamRoom.jsx`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/pages/ExamRoom.jsx#L117-L127) + [`frontend/src/store/slices/examSessionSlice.js`](file:///c:/Users/fromr/Desktop/BCK2/ExamTime/frontend/src/store/slices/examSessionSlice.js#L33-L38)

**💬 Câu trả lời mẫu:**

> "Dạ, hệ thống phát hiện gian lận hoạt động theo cơ chế: Trình duyệt có sự kiện `visibilitychange` — mỗi khi thí sinh chuyển tab hoặc thu nhỏ cửa sổ, trình duyệt phát ra sự kiện này. Code của em lắng nghe sự kiện đó: nếu trang bị ẩn (`document.hidden === true`) và phiên thi đang diễn ra (`status === 'IN_PROGRESS'`), hệ thống ghi lại 1 bản ghi `{ type: 'TAB_SWITCH', timestamp: ... }` vào Redux store.
> 
> Khi thí sinh nộp bài, toàn bộ danh sách gian lận (`cheatingLog`) được gửi lên server cùng bài làm, lưu vào database. Admin có trang riêng (`AdminCheatingLogs`) để xem ai đã chuyển tab bao nhiêu lần, lúc mấy giờ."

---

## 2. TUYỆT CHIÊU "ĐÁNH TRỐNG LẢNG" 🥁

Khi giám khảo hỏi vào tính năng mà bạn chưa nắm vững hoặc đoạn code phức tạp mà bạn tham khảo từ nguồn khác, hãy dùng **2 mẫu câu dưới đây**:

---

### 🎯 Mẫu 1: "Thừa nhận nguồn tham khảo + nêu bài học rút ra"

> *"Dạ, phần [tên tính năng] này em có tham khảo từ tài liệu chính thức của [tên thư viện] và một số bài hướng dẫn trên cộng đồng. Tuy nhiên, em không copy nguyên mà đã phải đọc hiểu rồi chỉnh sửa cho phù hợp với logic đặc thù của dự án — ví dụ như phần [nêu 1 chi tiết cụ thể đã customize]. Qua quá trình đó, em rút ra được bài học là [nêu 1 điều đã học được, ví dụ: cách middleware chain hoạt động, hoặc cách FormData gửi file kèm text]. Em nghĩ đây là kỹ năng tự học và ứng dụng mà mọi lập trình viên đều cần có."*

### 🎯 Mẫu 2: "Thú nhận giới hạn + thể hiện định hướng phát triển"

> *"Dạ thật ra phần [tên tính năng] em hiểu ở mức cơ bản là nó đầu vào gì, đầu ra gì, nhưng một số chi tiết bên trong em chưa nắm sâu 100%. Nếu có thêm thời gian, em sẽ nghiên cứu kỹ hơn về [nêu 1 hướng cụ thể, ví dụ: tối ưu performance, thêm unit test, hoặc triển khai Error Boundaries]. Em tin rằng việc nhận ra giới hạn và biết mình cần học thêm gì cũng là một phần quan trọng của quá trình phát triển."*

---

## 3. MẸO BỔ SUNG KHI BẢO VỆ

### 🧠 Khi bị hỏi "Tại sao dùng công nghệ X mà không dùng Y?"

| Câu hỏi | Gợi ý trả lời |
|---------|---------------|
| Tại sao MongoDB không dùng MySQL? | "MongoDB linh hoạt hơn cho dữ liệu dạng câu hỏi/đáp án lồng nhau. Đề thi IELTS có cấu trúc phức tạp (sections → questions → options), MongoDB lưu dạng JSON tự nhiên hơn bảng quan hệ." |
| Tại sao Redux mà không dùng Context? | "Context re-render hết mọi component khi state thay đổi. Redux cho phép subscribe chọn lọc, phù hợp với dữ liệu cập nhật thường xuyên như câu trả lời thi." |
| Tại sao Vite mà không dùng CRA? | "Vite khởi động nhanh hơn CRA rất nhiều vì dùng ESBuild biên dịch, và cộng đồng React đã chuyển sang Vite là xu hướng mới." |
| Tại sao không dùng TypeScript? | "Do giới hạn thời gian và kinh nghiệm. Nếu có thêm thời gian, em sẽ chuyển sang TypeScript để phát hiện lỗi sớm hơn." |

### 🎯 "Danh sách điều cần nhớ" trước khi bảo vệ

1. **Biết rõ cấu trúc thư mục:** `models/` = bản vẽ DB, `controllers/` = logic xử lý, `routes/` = biển chỉ đường, `middlewares/` = bảo vệ
2. **Biết luồng request đi:** Client → Route → Middleware(s) → Controller → Model → Database → Controller → Response
3. **Biết 3 Redux slice:** auth (đăng nhập), examSession (phiên thi), answers (câu trả lời)
4. **Biết 4 middleware:** auth (kiểm tra token), admin (kiểm tra role), role (linh hoạt), filterExam (ẩn đáp án)
5. **Biết 2 loại chấm điểm:** Tự động (Listening/Reading) vs Thủ công (Writing/Speaking)
6. **Biết đặc biệt:** Phát hiện gian lận (visibilitychange), Retry kết nối DB, Session persistence (localStorage)

---

> 💪 **Chúc bạn bảo vệ thành công! Hãy tự tin — bạn đã có một dự án hoàn chỉnh với đầy đủ tính năng thực chiến.**

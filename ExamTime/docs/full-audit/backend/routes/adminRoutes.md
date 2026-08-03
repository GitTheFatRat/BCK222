# backend/routes/adminRoutes.js

## Muc dich (1-2 cau)
File này định nghĩa các tuyến đường (routes) API dành riêng cho các tác vụ quản trị hệ thống. Hiện tại nó chỉ phục vụ một chức năng duy nhất là kích hoạt quá trình nạp dữ liệu (ingest) bộ đề thi mới vào database.

## Import / phu thuoc
- `import { Router } from 'express';`: Khởi tạo đối tượng router của Express để gom nhóm các endpoint.
- `ingestExamFolder`: Hàm xử lý logic chính lấy từ `ingestController`.
- `authMiddleware`, `roleMiddleware`: Các bộ lọc bảo mật để đảm bảo chỉ Admin mới gọi được API này.

## Noi dung chi tiet
- **`const router = Router();`**: Tạo một mini-app (router) để gắn các route.
- **`router.post('/ingest-exam', ...)`**: Định nghĩa endpoint nhận method POST với đường dẫn `/ingest-exam`.
  - Chuỗi xử lý (middleware chain):
    1. `authMiddleware`: Chạy đầu tiên để xác thực token và trích xuất `req.user`.
    2. `roleMiddleware('admin')`: Chạy thứ 2 để kiểm tra `req.user.role` có phải là `admin` không.
    3. `ingestExamFolder`: Chạy cuối cùng để thực thi logic nạp data.
- **`export default router;`**: Xuất router ra ngoài để gắn vào ứng dụng Express chính.

## Duoc su dung boi (dependents)
- `backend/server.js`: Nhập và gắn router này vào đường dẫn gốc `/api/admin`. Suy ra, endpoint đầy đủ để nạp đề thi sẽ là `POST /api/admin/ingest-exam`.

## Diem dang chu y (neu co)
- Code rất ngắn gọn và tuân thủ chặt chẽ mô hình kiến trúc chuẩn của Express (tách biệt Route và Controller).
- Việc dùng `roleMiddleware('admin')` ở đây cho thấy tính ưu việt của closure so với việc dùng `adminMiddleware` tĩnh ở các file khác. Khuyến nghị nên áp dụng cách dùng này đồng bộ trên toàn dự án.
